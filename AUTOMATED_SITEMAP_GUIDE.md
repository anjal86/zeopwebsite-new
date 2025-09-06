# Automated Sitemap System - Zeo Tourism

## Overview
This system automatically generates and updates your website's sitemap whenever content changes, ensuring search engines always have the latest information about your tours, destinations, and activities.

## 🚀 Features

### 1. **Dynamic Content Discovery**
- **Tours**: Automatically scans `/api/data/tour-details/` directory
- **Destinations**: Reads from `/api/data/destinations.json`
- **Activities**: Includes from `/api/data/activities.json`
- **Real-time Updates**: Detects when new content is added

### 2. **Multiple Automation Options**
- **Build Integration**: Runs during `npm run build`
- **File Monitoring**: Watches for file changes and auto-updates
- **Webhook Triggers**: HTTP endpoint for external triggers
- **Manual Generation**: On-demand sitemap creation

### 3. **Smart Priority Assignment**
- **High Priority (0.9)**: Everest Base Camp, Annapurna Circuit
- **Medium Priority (0.8)**: Popular destinations and tours
- **Standard Priority (0.7)**: Regular tours and activities
- **Static Pages**: Homepage (1.0), main pages (0.8-0.9)

## 📋 Available Commands

### Basic Commands
```bash
# Generate sitemap once
npm run generate-sitemap

# Generate sitemap once (alternative)
npm run sitemap:once

# Build with automatic sitemap generation
npm run build

# Build without sitemap (if needed)
npm run build:no-sitemap
```

### Automation Commands
```bash
# Start file monitoring (auto-updates when files change)
npm run sitemap:monitor

# Start webhook server (trigger via HTTP)
npm run sitemap:webhook
```

## 🔄 Automation Methods

### Method 1: File Monitoring (Recommended for Development)
```bash
cd zeopwebsite
npm run sitemap:monitor
```
- **What it does**: Watches data files for changes
- **When to use**: During development when frequently adding content
- **Frequency**: Checks every minute, updates immediately when changes detected
- **Pros**: Automatic, no manual intervention needed
- **Cons**: Requires a running process

### Method 2: Build Integration (Recommended for Production)
```bash
npm run build
```
- **What it does**: Generates sitemap before building the website
- **When to use**: Every time you deploy to production
- **Frequency**: Once per build/deployment
- **Pros**: Guaranteed fresh sitemap on every deployment
- **Cons**: Only updates when you build/deploy

### Method 3: Webhook Triggers
```bash
npm run sitemap:webhook
```
- **What it does**: Creates HTTP endpoint for external triggers
- **When to use**: Integration with CMS, admin panel, or external systems
- **Frequency**: On-demand via HTTP POST
- **Webhook URL**: `http://localhost:3001/webhook/regenerate-sitemap`
- **Pros**: Can be triggered from anywhere
- **Cons**: Requires webhook server to be running

### Method 4: Scheduled Tasks (Recommended for Production)
Set up a cron job or Windows Task Scheduler:
```bash
# Every hour
0 * * * * cd /path/to/zeopwebsite && npm run sitemap:once

# Every day at 2 AM
0 2 * * * cd /path/to/zeopwebsite && npm run sitemap:once
```

## 🛠️ Setup Instructions

### For Development Environment
1. **Start file monitoring**:
   ```bash
   cd zeopwebsite
   npm run sitemap:monitor
   ```
2. **Add new content** through admin panel or by adding files
3. **Sitemap updates automatically** within 1 minute

### For Production Environment
1. **Option A - Build Integration** (Easiest):
   - Just run `npm run build` before deployment
   - Sitemap is automatically generated with latest content

2. **Option B - Scheduled Updates**:
   ```bash
   # Add to crontab (Linux/Mac) or Task Scheduler (Windows)
   0 2 * * * cd /path/to/zeopwebsite && npm run sitemap:once
   ```

3. **Option C - Webhook Integration**:
   ```bash
   # Start webhook server
   npm run sitemap:webhook
   
   # Trigger from external system
   curl -X POST http://your-server:3001/webhook/regenerate-sitemap
   ```

## 📊 Current Sitemap Stats
- **Total URLs**: 33
- **Static Pages**: 7 (Home, About, Tours, Destinations, Activities, Contact, Kailash Mansarovar)
- **Tours**: 4 (Everest Base Camp, Annapurna Circuit, Langtang Valley, Chitwan Safari)
- **Destinations**: 14 (All destinations from API data)
- **Activities**: 8 (All activities from API data)

## 🔧 Configuration

### Monitoring Settings
- **Check Interval**: 60 seconds (configurable in `autoSitemapUpdate.js`)
- **Webhook Port**: 3001 (configurable via `SITEMAP_WEBHOOK_PORT` env var)
- **Base URL**: https://zeotourism.com (configurable in `generateSitemap.cjs`)

### Priority Rules
Edit `generateSitemap.cjs` to modify priority assignments:
```javascript
// High priority tours
const highPriorityTours = [
  'everest-base-camp-trek',
  'annapurna-circuit-trek',
  'your-new-popular-tour'
];

// High priority destinations
const highPriorityDestinations = ['everest', 'annapurna', 'kathmandu'];
```

## 📈 Benefits for SEO

### Google Sitelinks
- **Always up-to-date**: Search engines see new content immediately
- **Proper priorities**: Important content gets higher priority
- **Clean URLs**: Special characters handled properly
- **Timestamp accuracy**: Real modification dates used

### Search Engine Optimization
- **Faster indexing**: New content discovered quickly
- **Better crawling**: Priority-based URL organization
- **No broken links**: Only existing content included
- **Mobile-friendly**: Responsive sitemap structure

## 🚨 Troubleshooting

### Common Issues

**Sitemap not updating**:
1. Check if monitoring process is running
2. Verify file permissions on data directories
3. Check console for error messages
4. Manually run `npm run sitemap:once` to test

**Build fails**:
1. Try `npm run build:no-sitemap` to skip sitemap generation
2. Check if data files exist and are readable
3. Verify Node.js has write permissions to public directory

**Webhook not responding**:
1. Check if webhook server is running on correct port
2. Verify firewall settings allow connections
3. Test with curl: `curl -X POST http://localhost:3001/webhook/regenerate-sitemap`

### Debug Commands
```bash
# Test sitemap generation
npm run sitemap:once

# Check what files are being detected
node scripts/autoSitemapUpdate.js --monitor

# Test webhook
curl -X POST http://localhost:3001/webhook/regenerate-sitemap
```

## 🎯 Production Deployment

### Recommended Setup
1. **Build Integration**: Always use `npm run build` for deployments
2. **Scheduled Updates**: Set up daily cron job for fresh content
3. **Webhook Backup**: Optional webhook for immediate updates
4. **Monitoring**: Log sitemap generation for debugging

### Example Production Script
```bash
#!/bin/bash
# production-deploy.sh

echo "🚀 Starting production deployment..."

# Generate fresh sitemap
echo "📄 Generating sitemap..."
npm run sitemap:once

# Build application
echo "🔨 Building application..."
npm run build:no-sitemap  # Skip duplicate generation

# Deploy to server
echo "🌐 Deploying to server..."
# Your deployment commands here

echo "✅ Deployment completed!"
```

## 📞 Support

### Adding New Content Types
To include new content types in the sitemap:
1. Edit `generateSitemap.cjs`
2. Add new data source function
3. Include in `allUrls` array
4. Test with `npm run sitemap:once`

### Modifying Update Frequency
Edit `autoSitemapUpdate.js`:
```javascript
const SITEMAP_CHECK_INTERVAL = 30000; // 30 seconds instead of 60
```

### Custom Webhook Integration
```javascript
// Example: Trigger from admin panel
fetch('/api/generate-sitemap', { method: 'GET' })
  .then(response => response.json())
  .then(data => console.log('Sitemap updated:', data));
```

---

**Last Updated**: January 2024  
**Version**: 1.0  
**Compatibility**: Node.js 16+, Windows/Linux/Mac

For technical support, contact the development team.