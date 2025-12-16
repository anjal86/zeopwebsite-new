#!/bin/bash

# Configuration
PROJECT_ROOT="/Users/shrestha/Brandspire Work/zeopwebsite-new"
DEPLOY_DIR="$PROJECT_ROOT/deployment_package"
FRONTEND_DIR="$PROJECT_ROOT/zeopwebsite"
BACKEND_DIR="$PROJECT_ROOT/api"

echo "🚀 Starting Deployment Build Process..."

# 1. Clean previous deployment package
if [ -d "$DEPLOY_DIR" ]; then
    echo "🧹 Cleaning previous deployment folder..."
    rm -rf "$DEPLOY_DIR"
fi
mkdir -p "$DEPLOY_DIR"

# 2. Build Frontend
echo "📦 Building Frontend (React)..."
cd "$FRONTEND_DIR" || exit
# Ensure dependencies are installed (optional, maybe skip if node_modules exists to save time?)
# npm install
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

# 3. Copy Frontend Build files
echo "📂 Copying Frontend files to deployment folder..."
cp -r "$FRONTEND_DIR/dist/"* "$DEPLOY_DIR/"

# 4. Copy .htaccess
if [ -f "$FRONTEND_DIR/.htaccess" ]; then
    echo "📄 Copying .htaccess..."
    cp "$FRONTEND_DIR/.htaccess" "$DEPLOY_DIR/"
else
    echo "⚠️  Warning: .htaccess not found in zeopwebsite! Please create one."
fi

# 5. Prepare Backend
echo "⚙️  Preparing Backend (API)..."
mkdir -p "$DEPLOY_DIR/api"

# Use rsync to copy backend files, excluding node_modules, .git, and specific extensive folders if needed
# We exclude 'uploads' to keep the package small (create folder instead)
rsync -av --progress "$BACKEND_DIR/" "$DEPLOY_DIR/api/" \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.env' \
    --exclude '.DS_Store' \
    --exclude 'uploads/*'

# Explicitly remove node_modules if it somehow got there (Critical for CloudLinux)
if [ -d "$DEPLOY_DIR/api/node_modules" ]; then
    echo "🧹 Removing node_modules from API deployment folder (CloudLinux requirement)..."
    rm -rf "$DEPLOY_DIR/api/node_modules"
fi

# Create uploads directory if it doesn't exist (because we excluded content)
mkdir -p "$DEPLOY_DIR/api/uploads"

echo "📄 Creating default .env information..."
# Create a dummy .env or copy example
if [ -f "$BACKEND_DIR/.env.example" ]; then
    cp "$BACKEND_DIR/.env.example" "$DEPLOY_DIR/api/.env"
else
    echo "# Production Environment Variables" > "$DEPLOY_DIR/api/.env"
    echo "PORT=3000" >> "$DEPLOY_DIR/api/.env"
    echo "JWT_SECRET=change_this_to_a_secure_random_string" >> "$DEPLOY_DIR/api/.env"
    echo "NODE_ENV=production" >> "$DEPLOY_DIR/api/.env"
fi

# 6. Create Deployment Instructions
echo "📝 Generating Deployment Instructions..."
cat > "$DEPLOY_DIR/README_DEPLOY.txt" << EOL
Zeo Tourism Website - Deployment Instructions
=============================================

This folder contains everything needed to deploy the website to a cPanel/hosting environment.

Structure:
- /         -> Contains the React Frontend files (index.html, assets/, etc.)
- /api      -> Contains the Node.js Backend
- .htaccess -> Application routing configuration

Instructions:
1. Upload all contents of this folder to your 'public_html' (or subdomain folder).
2. Backend Setup:
   - Go to 'api' folder.
   - If using cPanel Node.js Selector:
     - Point Application Root to 'api' folder.
     - IMPORTANT: Ensure NO 'node_modules' folder exists in 'api' before clicking 'Create' or 'Run NPM Install'.
     - The panel will create a symlink for 'node_modules'.
     - Run 'npm install' via the panel or terminal.
     - Restart the Node.js application.
   - Note: The 'api/data' folder contains the database (JSON files).
     If updating an existing site, BE CAREFUL not to overwrite your production 'api/data' folder unless necessary!

3. Frontend Setup:
   - The frontend files are static and pre-built.
   - Ensure .htaccess is present in the root.

IMPORTANT:
- Edit 'api/.env' with your production secrets if needed.
- Ensure file permissions are correct (usually 644 for files, 755 for folders).

EOL

echo "✅ Build & Package Complete!"
echo "📂 Location: $DEPLOY_DIR"
