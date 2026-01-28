from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import asyncio
import requests
from urllib.parse import urlparse
from bfs_crawler import bfs_crawler
from utils.intent import extract_audit_config

app = Flask(__name__)
CORS(app)

# Initialize SocketIO with CORS support
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')


def validate_url(url):
    if not url or not url.strip():
        return False, "URL is required"
    
    # Parse URL
    try:
        parsed = urlparse(url)
    except Exception:
        return False, "Invalid URL format"
    
    # Check if scheme is http or https
    if parsed.scheme not in ['http', 'https']:
        return False, "URL must start with http:// or https://"
    
    # Check if domain exists
    if not parsed.netloc:
        return False, "URL must include a domain name"
    
    return True, None


def check_url_reachable(url, timeout=10):
    try:
        # HEAD request (faster than GET, doesn't download full page)
        response = requests.head(url, timeout=timeout, allow_redirects=True)
        
        # Accept 2xx and 3xx status codes as success
        if response.status_code < 400:
            return True, None
        else:
            return False, f"Website returned status code {response.status_code}"
            
    except requests.exceptions.Timeout:
        return False, "Request timeout - website took too long to respond"
    except requests.exceptions.ConnectionError:
        return False, "Connection error - could not reach the website"
    except requests.exceptions.TooManyRedirects:
        return False, "Too many redirects"
    except Exception as e:
        return False, f"Error checking URL: {str(e)}"


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ok",
        "message": "QAI Backend API is running"
    }), 200


@socketio.on('start_analysis')
def handle_start_analysis(data):
    """WebSocket handler for starting analysis with streaming logs"""
    # Capture the client's session ID for emitting outside of request context
    sid = request.sid

    def emit_to_client(event, payload):
        """Wrapper that emits to the specific client using their session ID"""
        socketio.emit(event, payload, room=sid)

    try:
        url = data.get('url', '').strip()
        max_pages = data.get('max_pages', 5)
        user_intent = data.get('user_intent', None)

        # Validate max_pages
        if not isinstance(max_pages, int) or max_pages < 1 or max_pages > 10:
            emit_to_client('error', {'message': 'max_pages must be an integer between 1 and 10'})
            return

        # Validate URL format
        is_valid, error_msg = validate_url(url)
        if not is_valid:
            emit_to_client('error', {'message': error_msg})
            return

        emit_to_client('log', {'message': f'Checking if {url} is reachable...', 'type': 'info'})

        is_reachable, error_msg = check_url_reachable(url)
        if not is_reachable:
            emit_to_client('error', {'message': error_msg})
            return

        emit_to_client('log', {'message': 'URL is reachable. Starting analysis...', 'type': 'success'})

        # Parse user intent if provided
        audit_config = None
        if user_intent:
            emit_to_client('log', {'message': 'Parsing user intent...', 'type': 'info'})
            audit_config_obj = extract_audit_config(user_intent)
            if audit_config_obj:
                audit_config = audit_config_obj.model_dump()
                emit_to_client('log', {'message': 'Intent parsed successfully', 'type': 'success'})
            else:
                emit_to_client('log', {'message': 'Warning: Failed to parse intent, continuing without it...', 'type': 'warning'})

        # Run the BFS crawler with emit function for streaming logs
        results = asyncio.run(bfs_crawler(url, max_pages, audit_config, emit_log=emit_to_client))

        # Add audit_config to results
        if audit_config:
            results['audit_config'] = audit_config

        emit_to_client('log', {'message': f'Analysis complete. Analyzed {results["total_pages_analyzed"]} pages.', 'type': 'success'})
        emit_to_client('complete', {'status': 'success', 'data': results})

    except Exception as e:
        print(f"ERROR in start_analysis: {str(e)}")
        emit_to_client('error', {'message': f'Internal server error: {str(e)}'})


@app.route('/api/analyze', methods=['POST'])
def analyze_website():
    try:
        # Get data from request
        data = request.get_json()

        if not data:
            return jsonify({
                "status": "error",
                "message": "Request body is required"
            }), 400

        url = data.get('url', '').strip()
        max_pages = data.get('max_pages', 5)
        user_intent = data.get('user_intent', None)

        # Validate max_pages
        if not isinstance(max_pages, int) or max_pages < 1 or max_pages > 10:
            return jsonify({
                "status": "error",
                "message": "max_pages must be an integer between 1 and 10"
            }), 400

        # Validate URL format
        is_valid, error_msg = validate_url(url)
        if not is_valid:
            return jsonify({
                "status": "error",
                "message": error_msg
            }), 400

        # Check if URL is reachable
        print(f"Checking if {url} is reachable...")
        is_reachable, error_msg = check_url_reachable(url)
        if not is_reachable:
            return jsonify({
                "status": "error",
                "message": error_msg
            }), 400

        print(f"URL is reachable. Starting analysis...")

        # 4. Parse user intent if provided
        audit_config = None
        if user_intent:
            print(f"Parsing user intent: {user_intent[:100]}...")
            audit_config_obj = extract_audit_config(user_intent)
            if audit_config_obj:
                # Convert Pydantic model to dict
                audit_config = audit_config_obj.model_dump()
                print(f"Parsed config: {audit_config}")
            else:
                print("Warning: Failed to parse user intent, continuing without it...")

        # 5. Run the BFS crawler (this will take 2-5 minutes)
        # asyncio.run() handles the async function in sync Flask context
        results = asyncio.run(bfs_crawler(url, max_pages, audit_config))

        # Add audit_config to results for frontend display
        if audit_config:
            results['audit_config'] = audit_config

        print(f"Analysis complete. Analyzed {results['total_pages_analyzed']} pages.")

        # 5. Return results
        return jsonify({
            "status": "success",
            "data": results
        }), 200

    except Exception as e:
        # Catch any unexpected errors
        print(f"ERROR in /api/analyze: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Internal server error: {str(e)}"
        }), 500


@app.route('/', methods=['GET'])
def root():
    """
    Root endpoint - provides API information
    """
    return jsonify({
        "name": "QAI - Quality AI Analyzer",
        "version": "1.0.0",
        "description": "Analyzes websites for CTA efficiency and theme consistency",
        "endpoints": {
            "health": "GET /api/health",
            "analyze": "POST /api/analyze"
        }
    }), 200


if __name__ == '__main__':
    print("="*60)
    print("QAI Backend API Server")
    print("="*60)
    print("Server starting on http://localhost:5000")
    print("API endpoint: POST http://localhost:5000/api/analyze")
    print("WebSocket: ws://localhost:5000 (event: start_analysis)")
    print("Health check: GET http://localhost:5000/api/health")
    print("="*60)

    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
