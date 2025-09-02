# Production Deployment Guide for Zeo Tourism Website

## Current Issue
The frontend is trying to call API endpoints at `https://zeo.brandspire.com.np/api/` but getting HTML responses (404 pages) instead of JSON. This means the Node.js API server is not deployed or running on the production server.

## ✅ SQLite3 Dependencies Removed
All SQLite3 dependencies have been removed from the deployment package.json. The API server now uses only JSON files for data storage, eliminating native compilation issues.

## Required Steps to Fix API Issues

### 1. Deploy Node.js API Server
The production server needs to run the Node.js API server from this deployment folder.

**Files needed on production server:**
- `server.js` - Main API server (JSON-based, no SQLite)
- `package.json` - Dependencies (SQLite3 removed)
- `data/` folder - All JSON data files
- `uploads/` folder - All uploaded media files

### 2. Install Dependencies
On the production server, run:
```bash
npm install
```
**Note:** No native compilation required - all dependencies are pure JavaScript.

### 3. Start the API Server
The API server should be running on the production server:
```bash
node server.js
```
Or using PM2 for production:
```bash
pm2 start server.js --name "zeo-api"
```

### 4. Configure Web Server (Apache/Nginx)
The web server needs to:
1. Serve the static files from `dist/` folder
2. Proxy API requests to the Node.js server

**Apache Configuration (.htaccess):**
```apache
# Serve static files
RewriteEngine On

# API proxy - redirect /api requests to Node.js server
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]

# Serve React app for all other routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name zeo.brandspire.com.np;
    
    # Serve static files
    location / {
        root /path/to/deployment/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to Node.js
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Serve uploaded files
    location /uploads/ {
        root /path/to/deployment;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 5. Environment Configuration
Ensure the Node.js server is configured for production:
- Set `NODE_ENV=production`
- Configure proper port (default 3000)
- Ensure CORS is properly configured (already done in server.js)

### 6. File Permissions
Ensure proper permissions for:
- `uploads/` folder (write permissions for file uploads)
- `data/` folder (write permissions for data updates)

## Current Status
✅ Frontend built and ready
✅ API server code ready with CORS fixes
✅ All data files updated
❌ Node.js API server not deployed on production
❌ Web server not configured to proxy API requests

## Quick Test
To verify the API server works locally:
1. Navigate to deployment folder
2. Run `npm install`
3. Run `node server.js`
4. Test: `curl http://localhost:3000/api/sliders`

## Files Ready for Deployment
All necessary files are in the `deployment/` folder:
- `server.js` - API server with CORS fixes
- `package.json` - Dependencies
- `data/` - All JSON data including new Kailash slider
- `dist/` - Built React application
- `.htaccess` - Apache configuration