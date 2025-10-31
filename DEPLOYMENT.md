# Lungiverse Deployment Guide

Complete guide for deploying Lungiverse to your own hosting infrastructure.

## 🎯 Quick Start

### Prerequisites
- Node.js 18+ installed
- Firebase project setup complete
- Domain name configured
- Server/VPS ready

### 5-Minute Deployment

```bash
# 1. Clone or download this repository
cd lungiverse

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your settings

# 4. Place Firebase credentials
# Copy serviceAccountKey.json to firebase-config/

# 5. Build the application
npm run build

# 6. Start production server
npm start
```

Your app should now be running on http://localhost:5000

## 📁 Project Structure

```
lungiverse/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── lib/               # Firebase, API client
│   │   └── hooks/             # Custom React hooks
│   └── index.html
│
├── server/                     # Express backend
│   ├── index.ts               # Server entry point
│   ├── routes.ts              # API routes
│   ├── firebaseAdmin.ts       # Firebase Admin SDK
│   ├── firebaseAuth.ts        # Auth middleware
│   └── firestoreStorage.ts    # Database operations
│
├── shared/                     # Shared code
│   └── schema.ts              # TypeScript types
│
├── firebase-config/            # Firebase credentials
│   ├── serviceAccountKey.json # DON'T commit this!
│   └── firebase.config.js     # Frontend config
│
├── scripts/
│   └── migrate-to-firestore.ts # Migration script
│
├── dist/                       # Built files (generated)
│   ├── public/                # Frontend build
│   └── index.js               # Backend build
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env                        # DON'T commit this!
```

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory:

```env
# Session secret (generate random string)
SESSION_SECRET=your-random-string-here-change-this

# Firebase configuration
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-config/serviceAccountKey.json

# Domain
DOMAIN=lungiverse.com

# Environment
NODE_ENV=production

# Port (optional, defaults to 5000)
PORT=5000
```

### Generate Secure SESSION_SECRET

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Online
# Visit: https://generate-secret.vercel.app/32
```

## 🚀 Deployment Options

### Option 1: Simple VPS Deployment (Recommended)

**Requirements:**
- Ubuntu 20.04+ or similar Linux distribution
- 1GB+ RAM
- Node.js 18+ installed

**Steps:**

1. **Setup server:**
```bash
# SSH into your server
ssh user@your-server-ip

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2
```

2. **Transfer files:**
```bash
# On your local machine
scp -r lungiverse/ user@your-server-ip:~/
```

3. **Configure and start:**
```bash
# On your server
cd ~/lungiverse

# Install dependencies
npm install

# Configure environment
nano .env  # Add your configuration

# Build application
npm run build

# Start with PM2
pm2 start dist/index.js --name lungiverse

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions PM2 gives you
```

4. **Setup NGINX reverse proxy:**
```bash
# Install NGINX
sudo apt install nginx

# Create NGINX configuration
sudo nano /etc/nginx/sites-available/lungiverse
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name lungiverse.com www.lungiverse.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/lungiverse /etc/nginx/sites-enabled/

# Test NGINX configuration
sudo nginx -t

# Restart NGINX
sudo systemctl restart nginx
```

5. **Setup SSL with Let's Encrypt:**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d lungiverse.com -d www.lungiverse.com

# Auto-renewal is automatic!
```

### Option 2: Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built files
COPY dist/ ./dist/
COPY firebase-config/ ./firebase-config/
COPY attached_assets/ ./attached_assets/

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "dist/index.js"]
```

**Build and run:**
```bash
# Build image
docker build -t lungiverse:latest .

# Run container
docker run -d \
  --name lungiverse \
  -p 5000:5000 \
  -v $(pwd)/firebase-config:/app/firebase-config:ro \
  --env-file .env \
  --restart unless-stopped \
  lungiverse:latest
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - ./firebase-config:/app/firebase-config:ro
      - ./attached_assets:/app/attached_assets:ro
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:5000/api/tools"]
      interval: 30s
      timeout: 10s
      retries: 3
```

```bash
# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Option 3: Cloud Platform Deployment

#### Google Cloud Platform (Cloud Run)

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/lungiverse-75fe3/lungiverse

# Deploy to Cloud Run
gcloud run deploy lungiverse \
  --image gcr.io/lungiverse-75fe3/lungiverse \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars SESSION_SECRET=your-secret
```

#### AWS (Elastic Beanstalk)

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js lungiverse

# Create environment
eb create lungiverse-prod

# Deploy
eb deploy
```

#### Heroku

```bash
# Install Heroku CLI
# Then:

heroku create lungiverse

# Set environment variables
heroku config:set SESSION_SECRET=your-secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

## 📊 Monitoring & Logging

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs lungiverse

# Show application info
pm2 show lungiverse

# Restart application
pm2 restart lungiverse

# Stop application
pm2 stop lungiverse
```

### Application Logs

Logs are written to:
- **PM2 logs:** `~/.pm2/logs/`
- **Application logs:** Console output (captured by PM2)

### Firebase Monitoring

1. Go to Firebase Console
2. Navigate to **Firestore** → **Usage** to monitor:
   - Document reads/writes
   - Storage usage
   - Index usage

## 🔒 Security Best Practices

### 1. Secure Firebase Credentials

```bash
# Set proper permissions
chmod 600 firebase-config/serviceAccountKey.json

# Don't commit sensitive files
echo "firebase-config/serviceAccountKey.json" >> .gitignore
echo ".env" >> .gitignore
```

### 2. Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### 3. Regular Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Update Node.js dependencies
npm audit
npm audit fix
```

### 4. Backup Strategy

**Firestore Backups:**
```bash
# Setup automatic backups in Firebase Console
# Or use gcloud:
gcloud firestore export gs://your-bucket-name/backups/$(date +%Y%m%d)
```

**Code Backups:**
- Use Git for version control
- Push to private repository (GitHub/GitLab/Bitbucket)

## 🔄 Updating Your Application

### Local Changes

```bash
# 1. Make changes locally
# 2. Test thoroughly
npm run dev

# 3. Build
npm run build

# 4. Test production build
npm start
```

### Deploy Updates

```bash
# On your server
cd ~/lungiverse

# Pull latest changes (if using Git)
git pull

# Install new dependencies (if any)
npm install

# Rebuild
npm run build

# Restart with PM2
pm2 restart lungiverse

# Or with Docker
docker-compose down
docker-compose up -d --build
```

## 📈 Performance Optimization

### 1. Enable Gzip Compression

NGINX configuration:
```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### 2. Caching Static Assets

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. PM2 Cluster Mode

```bash
# Start with multiple instances
pm2 start dist/index.js -i max --name lungiverse
```

## 🐛 Troubleshooting

### Application won't start

```bash
# Check Node.js version
node --version  # Should be 18+

# Check environment variables
cat .env

# Check Firebase credentials
ls -la firebase-config/serviceAccountKey.json

# Check build output
ls -la dist/

# View detailed logs
pm2 logs lungiverse --lines 100
```

### Port already in use

```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill the process
sudo kill -9 <PID>
```

### NGINX errors

```bash
# Test configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# Restart NGINX
sudo systemctl restart nginx
```

### Firebase connection issues

```bash
# Verify service account
cat firebase-config/serviceAccountKey.json | jq .project_id

# Test Firebase connection
node -e "require('./dist/index.js')"
```

## 📞 Health Checks

### Manual Health Check

```bash
# Check API is responding
curl http://localhost:5000/api/tools

# Check from outside
curl https://lungiverse.com/api/tools
```

### Automated Monitoring

Use a service like:
- UptimeRobot (https://uptimerobot.com)
- Pingdom
- StatusCake

Check URL: `https://lungiverse.com/api/tools`
Expected response: JSON array of tools

## 🎉 Post-Deployment Checklist

After deployment, verify:

- ✅ Site accessible at https://lungiverse.com
- ✅ SSL certificate active (HTTPS)
- ✅ All 26 tools displayed
- ✅ All 11 articles with images
- ✅ Google Sign-In works
- ✅ Admin panel accessible (only for you)
- ✅ Can create articles
- ✅ Can favorite tools
- ✅ Search works
- ✅ Chatbot works (if enabled)
- ✅ Mobile responsive
- ✅ Fast page loads (<3s)

## 📚 Additional Resources

- Firebase Documentation: https://firebase.google.com/docs
- PM2 Documentation: https://pm2.keymetrics.io/docs
- NGINX Documentation: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/docs/

---

**Need Help?** Review logs first, then check the troubleshooting section. Most issues are related to environment variables or Firebase configuration.
