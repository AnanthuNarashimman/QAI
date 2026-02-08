# Deployment Configuration Guide

## Environment Variables

### Backend (.env)

```env
GEMINI_API_KEY = your_api_key_here
ENABLE_SCREENSHOTS = no  # Set to 'yes' for local dev, 'no' for deployment
```

### Screenshot Behavior

- **ENABLE_SCREENSHOTS = yes**: Captures and stores viewport screenshots (requires filesystem access)
- **ENABLE_SCREENSHOTS = no**: Returns "placeholder" string instead of base64 images

## Browser-Use Configuration for Deployment

### Key Requirements:

1. **Chromium Installation**
   ```bash
   # After installing requirements, run:
   playwright install chromium
   ```

2. **System Dependencies** (Linux/Render.com)
   Add to render.yaml or install script:
   ```bash
   apt-get update && apt-get install -y \
       libnss3 \
       libnspr4 \
       libatk1.0-0 \
       libatk-bridge2.0-0 \
       libcups2 \
       libdrm2 \
       libxkbcommon0 \
       libxcomposite1 \
       libxdamage1 \
       libxfixes3 \
       libxrandr2 \
       libgbm1 \
       libasound2
   ```

3. **Headless Mode**
   Browser-use automatically runs in headless mode, which is production-ready.

## Recommended Deployment Platform: Render.com

### Why Render?
- ✅ Free tier available
- ✅ WebSocket/Socket.io support
- ✅ Long-running processes
- ✅ Playwright/Chromium support
- ✅ Persistent filesystem (if needed later)

### Render.com Setup:

1. **Create render.yaml in backend folder:**
   ```yaml
   services:
     - type: web
       name: qai-backend
       env: python
       buildCommand: |
         pip install -r requirements.txt
         playwright install chromium
       startCommand: gunicorn --worker-class eventlet -w 1 app:app
       envVars:
         - key: GEMINI_API_KEY
           sync: false
         - key: ENABLE_SCREENSHOTS
           value: no
   ```

2. **Add gunicorn to requirements.txt:**
   ```
   gunicorn
   eventlet
   ```

3. **Update app.py** (add at the end):
   ```python
   if __name__ == '__main__':
       socketio.run(app, host='0.0.0.0', port=5000)
   ```

### Frontend Configuration (Vercel):

Update Socket.io connection in AuditPage.jsx:
```javascript
const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');
```

Add to .env (Vercel environment variables):
```
VITE_BACKEND_URL=https://your-render-app.onrender.com
```

## Alternative: Railway.app

Railway also supports this setup with similar configuration but uses Docker:

1. **Create Dockerfile:**
   ```dockerfile
   FROM python:3.11-slim
   
   WORKDIR /app
   
   RUN apt-get update && apt-get install -y \
       libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
       libcups2 libdrm2 libxkbcommon0 libxcomposite1 \
       libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2
   
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   RUN playwright install chromium
   
   COPY . .
   
   CMD ["gunicorn", "--worker-class", "eventlet", "-w", "1", "-b", "0.0.0.0:5000", "app:app"]
   ```

## Performance Considerations

### Without Screenshots (Recommended for Free Tier):
- Faster execution
- Lower memory usage
- No filesystem dependencies
- Better for serverless/constrained environments

### With Screenshots (Local Dev Only):
- Higher memory usage (Chromium + screenshots)
- Requires writable filesystem
- Slower execution
- Better for debugging/demos

## Testing Before Deployment

1. **Test with screenshots disabled:**
   ```bash
   # In backend/.env
   ENABLE_SCREENSHOTS=no
   
   python app.py
   ```

2. **Verify placeholder handling in frontend**
   Check that frontend displays "Screenshots coming soon" for placeholder values

## Summary

✅ **What's configured:**
- Environment variable ENABLE_SCREENSHOTS added
- Backend conditionally captures screenshots
- Placeholder system for disabled screenshots

❌ **What you DON'T need to configure:**
- Browser-use runs headless by default
- No special browser configuration required
- Chromium installation handled by `playwright install`

🚀 **Deployment checklist:**
1. Set ENABLE_SCREENSHOTS=no in production
2. Install Playwright browsers during build
3. Use Render.com or Railway for backend
4. Use Vercel for frontend
5. Update frontend Socket.io URL to production backend
