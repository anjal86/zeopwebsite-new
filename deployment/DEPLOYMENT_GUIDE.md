# Zeo Tourism Website - cPanel Deployment Guide

This guide will help you deploy the Zeo Tourism website to a cPanel hosting environment with SQLite database or JSON fallback.

## 📋 Prerequisites

- cPanel hosting account with Node.js support
- SSH access (recommended) or File Manager access
- Node.js version 16 or higher supported by your hosting provider

## 📁 Deployment Package Contents

```
deployment/
├── server.js              # Main server file (SQLite)
├── server-json.js          # Fallback server file (JSON)
├── database.js            # Database configuration and helpers
├── package.json           # Dependencies and scripts
├── setup-database.js      # Database initialization script
├── migrate-data.js        # Data migration script
├── .htaccess             # Apache configuration for routing
├── data/                 # JSON data files
│   ├── activities.json
│   ├── destinations.json
│   └── tours.json
└── public/               # Built React application
    ├── index.html
    ├── assets/
    └── ...
```

## 🚀 Deployment Steps

### Step 1: Upload Files to cPanel

1. **Via File Manager:**
   - Login to your cPanel
   - Open File Manager
   - Navigate to `public_html` (or your domain's document root)
   - Upload all files from the `deployment/` folder
   - Extract if uploaded as ZIP

2. **Via SSH (Recommended):**
   ```bash
   # Upload the deployment folder to your server
   scp -r deployment/* username@yourserver.com:~/public_html/
   ```

### Step 2: Setup Node.js Application

1. **In cPanel:**
   - Go to "Node.js Apps" or "Node.js Selector"
   - Click "Create Application"
   - Set the following:
     - **Node.js Version:** 16.x or higher
     - **Application Mode:** Production
     - **Application Root:** `public_html` (or your domain folder)
     - **Application URL:** Your domain
     - **Application Startup File:** `server.js` (try SQLite first)

2. **Environment Variables:**
   Set these environment variables in cPanel:
   ```
   NODE_ENV=production
   PORT=3000
   ```

### Step 3: Install Dependencies

1. **Via cPanel Terminal or SSH:**
   ```bash
   cd ~/public_html
   npm install --production
   ```

2. **Alternative via cPanel Node.js App:**
   - In the Node.js Apps section
   - Click on your application
   - Click "Run NPM Install"

### Step 4: Choose Database Option

#### Option A: SQLite Database (Recommended)

1. **Try SQLite first:**
   ```bash
   npm run setup-db
   npm run migrate-data
   ```

2. **If SQLite works, start with:**
   ```bash
   npm start
   ```

#### Option B: JSON Fallback (If SQLite fails)

If you encounter SQLite compilation errors (like GLIBC issues):

1. **Update your Node.js app startup file to:** `server-json.js`

2. **Start the JSON-based server:**
   ```bash
   npm run start-json
   ```

3. **Or manually:**
   ```bash
   node server-json.js
   ```

### Step 5: Configure Domain and SSL

1. **Domain Configuration:**
   - Ensure your domain points to the correct directory
   - The `.htaccess` file will handle routing

2. **SSL Certificate:**
   - Enable SSL in cPanel (Let's Encrypt is recommended)
   - Update CORS origins in your chosen server file with your HTTPS domain

### Step 6: Update Domain Configuration

Edit the CORS configuration in your chosen server file (`server.js` or `server-json.js`):

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://www.yourdomain.com'] // Replace with your domain
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
```

## 🔧 Configuration Options

### SQLite vs JSON Comparison

| Feature | SQLite | JSON Files |
|---------|--------|------------|
| Performance | Faster queries | Good for small datasets |
| Scalability | Better for growth | Limited by memory |
| Compatibility | May have issues on some hosts | Universal compatibility |
| Data Integrity | ACID compliance | File-based |
| Setup Complexity | Requires compilation | No compilation needed |

### When to Use Each Option

**Use SQLite (`server.js`) when:**
- Your hosting supports native compilation
- You need better performance
- You plan to scale the application
- You want proper database features

**Use JSON (`server-json.js`) when:**
- SQLite compilation fails
- You have a simple shared hosting
- You want maximum compatibility
- Your data doesn't change frequently

## 🔍 Troubleshooting

### SQLite Compilation Issues

If you see errors like:
```
GLIBC_2.29' not found
gyp ERR! build error
```

**Solution:** Switch to JSON mode:
1. Change startup file to `server-json.js` in cPanel Node.js Apps
2. Restart the application

### Common Issues

1. **Application won't start:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check error logs in cPanel
   - Try switching between SQLite and JSON modes

2. **Database/JSON errors:**
   - For SQLite: Check write permissions, try JSON fallback
   - For JSON: Verify data files are uploaded correctly

3. **Routing issues:**
   - Verify `.htaccess` file is uploaded
   - Check Apache mod_rewrite is enabled
   - Ensure file permissions are correct

4. **API not accessible:**
   - Check CORS configuration
   - Verify API endpoints with `/api/health`
   - Check firewall settings

### File Permissions

Set correct permissions:
```bash
chmod 644 *.js *.json .htaccess
chmod 755 public/
chmod 666 travel.db  # Only if using SQLite
```

## 📱 Testing Deployment

1. **Frontend Test:**
   - Visit your domain
   - Check if the website loads correctly
   - Test navigation between pages

2. **API Test:**
   - Visit `https://yourdomain.com/api/health`
   - Should show database type (SQLite or JSON Files)
   - Test API endpoints:
     - `/api/destinations`
     - `/api/tours`
     - `/api/activities`

3. **Database Test:**
   - Check if data loads on the website
   - Test search functionality
   - Verify featured content displays

## 🔄 Switching Between Modes

### From SQLite to JSON:
1. Change startup file in cPanel to `server-json.js`
2. Restart Node.js application
3. Test `/api/health` - should show "JSON Files"

### From JSON to SQLite:
1. Try installing dependencies again
2. Run database setup: `npm run setup-db && npm run migrate-data`
3. Change startup file to `server.js`
4. Restart application

## 📞 Support

If you encounter issues:

1. Check cPanel error logs
2. Verify Node.js application status
3. Test both server modes (SQLite and JSON)
4. Check file permissions
5. Contact hosting provider for Node.js support

## 🎯 Performance Notes

- **SQLite mode:** Better performance, requires successful compilation
- **JSON mode:** Slightly slower but universally compatible
- Both modes serve the same API endpoints
- Frontend application works identically with both

---

**Note:** The deployment package includes both SQLite and JSON modes for maximum compatibility. Start with SQLite, and fall back to JSON if needed.