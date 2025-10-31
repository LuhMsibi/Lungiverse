# 🚀 Lungiverse Production Deployment Guide

This guide provides **EXACT COMMANDS** to deploy Lungiverse to your production server.

---

## ✅ Prerequisites

- ✅ Firebase project created (lungiverse-75fe3)
- ✅ Data migrated to Firestore
- ✅ Domain name ready (lungiverse.com)
- ✅ Ubuntu/Debian server with SSH access
- ✅ Node.js 18+ installed on server

---

## 📋 Part 1: Prepare Your Server

### Step 1: SSH into Your Server

```bash
ssh your-username@your-server-ip
```

### Step 2: Install Node.js (if not installed)

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x or higher
npm --version
```

### Step 3: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### Step 4: Install Nginx (if deploying with custom domain)

```bash
# Install Nginx
sudo apt update
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

---

## 📦 Part 2: Deploy Your Application

### Step 1: Clone Your Repository

```bash
# Navigate to web directory
cd /var/www

# Clone your repository (replace with your GitHub URL)
sudo git clone https://github.com/YOUR_USERNAME/lungiverse.git
cd lungiverse

# Set ownership
sudo chown -R $USER:$USER /var/www/lungiverse
```

### Step 2: Install Dependencies

```bash
# Install all dependencies
npm install
```

### Step 3: Create Production Environment File

```bash
# Create .env file
nano .env
```

**Copy and paste this, replacing the Firebase credentials:**

```env
# Firebase Admin SDK (Backend)
FIREBASE_PROJECT_ID=lungiverse-75fe3
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xy79e@lungiverse-75fe3.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
YOUR_ACTUAL_PRIVATE_KEY_FROM_SERVICE_ACCOUNT_JSON
-----END PRIVATE KEY-----
"

# Node Environment
NODE_ENV=production
PORT=5000

# Session Secret - generate with: openssl rand -base64 32
SESSION_SECRET=$(openssl rand -base64 32)
```

**To get your Firebase Private Key:**

1. Open `attached_assets/lungiverse-75fe3-firebase-adminsdk-xy79e-0ab9bb5c85.json`
2. Copy the entire `private_key` value (including the `-----BEGIN...-----END-----` parts)
3. Paste it in the `.env` file

**Save and exit:** Press `Ctrl+X`, then `Y`, then `Enter`

### Step 4: Build the Application

```bash
# Build frontend and backend
npm run build
```

This creates:
- Frontend: `dist/public/`
- Backend: `dist/index.js`

### Step 5: Start with PM2

```bash
# Start the application
pm2 start npm --name "lungiverse" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup

# Check status
pm2 status
pm2 logs lungiverse
```

**Your app is now running on `http://your-server-ip:5000`!** 🎉

---

## 🌐 Part 3: Connect Your Domain (lungiverse.com)

### Step 1: Configure Nginx as Reverse Proxy

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/lungiverse.com
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name lungiverse.com www.lungiverse.com;

    # Increase timeouts for API requests
    proxy_read_timeout 300;
    proxy_connect_timeout 300;
    proxy_send_timeout 300;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Save and exit:** `Ctrl+X`, `Y`, `Enter`

### Step 2: Enable the Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/lungiverse.com /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 3: Point Your Domain to Server

**In your domain registrar (GoDaddy, Namecheap, etc.):**

1. Go to DNS settings for `lungiverse.com`
2. Add/Update these records:

```
Type    Name    Value                   TTL
A       @       YOUR_SERVER_IP         3600
A       www     YOUR_SERVER_IP         3600
```

**Wait 5-30 minutes for DNS propagation.**

### Step 4: Install SSL Certificate (HTTPS)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d lungiverse.com -d www.lungiverse.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose "2" to redirect HTTP to HTTPS

# Test auto-renewal
sudo certbot renew --dry-run
```

**Your site is now live at `https://lungiverse.com`!** 🎉🔒

---

## 👨‍💼 Part 4: Set Yourself as Admin

### Method 1: Using Firebase Console (Easiest)

1. Visit `https://lungiverse.com`
2. Sign in with Google
3. Note your email address
4. Go to Firebase Console → Authentication
5. Copy your User UID
6. Go to Firebase Console → Firestore Database
7. Navigate to `users` collection
8. Find your document (by email or UID)
9. Click "Edit"
10. Set `isAdmin` field to `true`
11. Save

### Method 2: Using Admin Endpoint (After Method 1)

1. Once you're admin, visit: `https://lungiverse.com/admin/seed`
2. You'll see the seed page (confirms admin access works)

---

## 🔄 Part 5: Future Updates

### Updating Your Site

```bash
# SSH into server
ssh your-username@your-server-ip

# Navigate to project
cd /var/www/lungiverse

# Pull latest code
git pull

# Rebuild
npm install
npm run build

# Restart PM2
pm2 restart lungiverse

# Check logs
pm2 logs lungiverse
```

### Useful PM2 Commands

```bash
# View logs
pm2 logs lungiverse

# Restart app
pm2 restart lungiverse

# Stop app
pm2 stop lungiverse

# View status
pm2 status

# Monitor CPU/Memory
pm2 monit
```

---

## 🐛 Troubleshooting

### App won't start

```bash
# Check PM2 logs
pm2 logs lungiverse --lines 100

# Check if port 5000 is in use
sudo lsof -i :5000

# Restart PM2
pm2 restart lungiverse
```

### Can't access via domain

```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Firebase auth not working

1. Check `.env` file has correct Firebase credentials
2. Verify `FIREBASE_PRIVATE_KEY` is properly formatted with `\n` newlines
3. Restart PM2: `pm2 restart lungiverse`

---

## 📊 Monitoring Your Site

### Check Application Health

```bash
# View real-time logs
pm2 logs lungiverse

# Monitor resources
pm2 monit

# Check uptime
pm2 status
```

### Check Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

---

## ✅ Verification Checklist

After deployment, verify these:

- [ ] Site loads at `https://lungiverse.com`
- [ ] Can view tools list
- [ ] Can view articles
- [ ] Can sign in with Google
- [ ] Your account shows as admin
- [ ] Admin pages accessible
- [ ] SSL certificate is active (green padlock)

---

## 🎉 Success!

Your Lungiverse platform is now:
- ✅ Running on your own server
- ✅ Using Firebase (not Replit)
- ✅ Accessible at your custom domain
- ✅ Secured with HTTPS
- ✅ Under your full control

**Need help?** Check the logs:
```bash
pm2 logs lungiverse
```
