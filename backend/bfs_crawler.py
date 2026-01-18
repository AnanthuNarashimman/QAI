import asyncio
from collections import deque
from urllib.parse import urlparse
from agent_core import extract_redirects, validate_page


def get_domain(url):
    """Extract clean domain from URL, removing www. prefix"""
    parsed = urlparse(url)
    domain = parsed.netloc.lower()
    # remove www. prefix
    if domain.startswith('www.'):
        domain = domain[4:]
    return domain


def normalize_url(url):
    """Normalize URL by removing trailing slash and fragments"""
    # Remove trailing slash
    if url.endswith('/'):
        url = url[:-1]
    # Remove fragments
    if '#' in url:
        url = url.split('#')[0]
    return url


def is_valid_link(url, base_domain):
    """Check if link should be crawled"""
    # Skip empty URLs
    if not url or not url.strip():
        return False
    
    # Skip non-http and non-https links
    if not url.startswith('http://') and not url.startswith('https://'):
        return False
    
    # Skip file downloads
    file_extensions = ['.pdf', '.zip', '.exe', '.dmg', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']
    if any(url.lower().endswith(ext) for ext in file_extensions):
        return False
    
    # Check if same domain
    link_domain = get_domain(url)
    return link_domain == base_domain


async def bfs_crawler(starting_url, max_pages=5):
    """
    Crawl website using BFS, analyzing each page for CTA and theme consistency.
    
    Args:
        starting_url: The initial URL to start crawling from
        max_pages: Maximum number of pages to analyze (default: 5)
    
    Returns:
        Dictionary containing analysis results for all crawled pages
    """
    # Initialize data structures
    queue = deque([normalize_url(starting_url)])
    visited = set()
    results = []
    base_domain = get_domain(starting_url)
    page_count = 0
    
    print(f"\nStarting BFS Crawler")
    print(f"Base URL: {starting_url}")
    print(f"Base Domain: {base_domain}")
    print(f"Max Pages: {max_pages}\n")
    
    while queue and page_count < max_pages:
        current_url = queue.popleft()
        
        # Skip if already visited
        if current_url in visited:
            continue
        
        visited.add(current_url)
        page_count += 1
        
        print(f"{'='*60}")
        print(f"Analyzing Page {page_count}/{max_pages}")
        print(f"URL: {current_url}")
        print(f"{'='*60}")
        
        try:
            # Extract navigation links
            print("Extracting navigation links...")
            extracted = await extract_redirects(current_url)
            
            # Validate page (CTA and theme analysis)
            print("Validating CTA and theme...")
            validation = await validate_page(current_url)
            
            # Process extracted links
            if extracted and 'posts' in extracted:
                new_links = [link['url'] for link in extracted['posts']]
                print(f"Found {len(new_links)} links")
                
                # Filter and add valid links to queue
                added_count = 0
                for link in new_links:
                    normalized_link = normalize_url(link)
                    
                    # Check if valid and not already visited/queued
                    if (is_valid_link(normalized_link, base_domain) and 
                        normalized_link not in visited and 
                        normalized_link not in queue):
                        queue.append(normalized_link)
                        added_count += 1
                
                print(f"Added {added_count} new links to queue")
            
            # Store results
            results.append({
                'url': current_url,
                'page_number': page_count,
                'validation': validation
            })
            
            print(f"Page {page_count} analysis complete\n")
            
        except Exception as e:
            print(f"ERROR analyzing {current_url}: {str(e)}")
            print(f"Skipping to next page...\n")
            # Store error result
            results.append({
                'url': current_url,
                'page_number': page_count,
                'error': str(e)
            })
    
    # Summary
    print(f"\n{'='*60}")
    print(f"Crawling Complete")
    print(f"{'='*60}")
    print(f"Total Pages Analyzed: {page_count}")
    print(f"URLs in Queue (not analyzed): {len(queue)}")
    print(f"Successfully Analyzed: {len([r for r in results if 'error' not in r])}")
    print(f"Errors: {len([r for r in results if 'error' in r])}")
    print(f"{'='*60}\n")
    
    return {
        'total_pages_analyzed': page_count,
        'urls_analyzed': list(visited),
        'results': results,
        'base_domain': base_domain
    }


# Test function
async def test_crawler():
    """Test the crawler with a sample URL"""
    test_url = "https://cubeaisolutions.com"
    results = await bfs_crawler(test_url, max_pages=5)
    
    print("\nFinal Results Summary:")
    for result in results['results']:
        if 'error' not in result:
            print(f"\n{result['url']}")
            if result.get('validation'):
                val = result['validation']
                if 'values' in val and len(val['values']) > 0:
                    v = val['values'][0]
                    print(f"   CTA Score: {v.get('cta_score', 'N/A')}/100")
                    print(f"   Theme Score: {v.get('theme_score', 'N/A')}/100")
        else:
            print(f"\nERROR: {result['url']} - {result['error']}")


if __name__ == "__main__":
    asyncio.run(test_crawler())