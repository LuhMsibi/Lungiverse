# Lungiverse Migration Guide: Replit → Self-Hosted with Firebase

This guide walks you through migrating Lungiverse from Replit's infrastructure to your own hosting with Firebase.

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Firebase project created (lungiverse-75fe3)
- ✅ Firebase service account JSON key downloaded
- ✅ Node.js 18+ installed
- ✅ Your own hosting server (VPS, cloud instance, etc.)
- ✅ Domain name (lungiverse.com) pointing to your server

## 🚀 Migration Steps

### Step 1: Run the Migration Script

This script exports all data from Replit's production PostgreSQL database and imports it into Firebase Firestore.

```bash
# Make sure you're connected to Replit production database
# DATABASE_URL should be set to production database

npm run migrate:firebase
```

**What it migrates:**
- ✅ All users (with Replit Auth IDs)
- ✅ All 26 AI tools
- ✅ All 11 articles with Unsplash images
- ✅ All user favorites
- ✅ All tool reviews and ratings
- ✅ Search history
- ✅ Analytics events
- ✅ Contact messages

**Expected output:**
```
🚀 Starting Lungiverse Migration: PostgreSQL → Firestore
============================================================
📦 Migrating users...
  ✓ Committed batch of 15 users
✅ Users: 15/15 migrated

📦 Migrating tools...
  ✓ Committed batch of 26 tools
✅ Tools: 26/26 migrated

... (similar for all collections)

📊 MIGRATION SUMMARY
============================================================
Users:            15/15 (0 errors)
Tools:            26/26 (0 errors)
Articles:         11/11 (0 errors)
... 
✅ Migration completed successfully!
```

### Step 2: Set Admin Access

After migration, set your admin privileges:

```bash
# Option 1: Via Firebase Console
# Go to Authentication > Users > Your user > Custom claims
# Add: { "isAdmin": true }

# Option 2: Via Firebase CLI
firebase auth:import-users --admin-claims '{"isAdmin": true}' <your-uid>

# Option 3: In the migration script (recommended)
# Edit scripts/migrate-to-firestore.ts line 410
# Uncomment and update:
await setAdminClaim("your-email@gmail.com");
```

### Step 3: Verify Data in Firebase Console

1. Go to https://console.firebase.google.com/
2. Select your project: **lungiverse-75fe3**
3. Click **Firestore Database**
4. Verify collections exist:
   - users
   - tools (should have 26 documents)
   - articles (should have 11 documents)
   - favorites
   - reviews

### Step 4: Deploy Firestore Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init firestore

# Deploy security rules
firebase deploy --only firestore:rules
```

**Security rules file:** `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Public read for tools and articles
    match /tools/{toolId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.isAdmin == true;
    }
    
    match /articles/{articleId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.isAdmin == true;
    }
    
    // Users can manage their own favorites and reviews
    match /favorites/{favoriteId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## 📦 Deployment Package

### What's Included

Your complete Lungiverse package includes:

```
lungiverse/
├── client/                  # React frontend (Vite)
├── server/                  # Express backend
├── shared/                  # Shared types and schemas
├── firebase-config/         # Firebase configuration
│   ├── serviceAccountKey.json
│   └── firebase.config.js
├── scripts/
│   └── migrate-to-firestore.ts
├── attached_assets/         # Article images
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example            # Environment variables template
├── DEPLOYMENT.md           # Deployment instructions
└── MIGRATION_GUIDE.md      # This file
```

### Environment Setup

1. **Copy environment file:**
```bash
cp .env.example .env
```

2. **Edit `.env` and configure:**
```env
SESSION_SECRET=generate-a-random-string-here
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-config/serviceAccountKey.json
DOMAIN=lungiverse.com
NODE_ENV=production
PORT=5000
```

3. **Place your Firebase service account key:**
```bash
# Make sure serviceAccountKey.json is in firebase-config/
ls firebase-config/serviceAccountKey.json
```

## 🖥️ Local Development

Run Lungiverse on your local machine:

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev
```

**Access your app:**
- Frontend: http://localhost:5000
- Backend API: http://localhost:5000/api

## 🌐 Production Deployment

### Option 1: Simple Node.js Deployment (No Docker)

**1. Build the application:**
```bash
npm run build
```

**2. Start production server:**
```bash
npm start
```

**3. Use PM2 for process management:**
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start dist/index.js --name lungiverse

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

**4. Setup NGINX as reverse proxy:**

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
    }
}
```

**5. Setup SSL with Let's Encrypt:**
```bash
sudo certbot --nginx -d lungiverse.com -d www.lungiverse.com
```

### Option 2: Docker Deployment

**1. Build Docker image:**
```bash
docker build -t lungiverse:latest .
```

**2. Run container:**
```bash
docker run -d \
  --name lungiverse \
  -p 5000:5000 \
  -v $(pwd)/firebase-config:/app/firebase-config \
  --env-file .env \
  --restart unless-stopped \
  lungiverse:latest
```

**3. Use Docker Compose:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - ./firebase-config:/app/firebase-config
    env_file:
      - .env
    restart: unless-stopped
```

```bash
docker-compose up -d
```

## 🔒 Security Checklist

Before going live, ensure:

- ✅ Firebase security rules deployed
- ✅ Admin custom claim set for your account only
- ✅ Domain added to Firebase authorized domains
- ✅ SSL certificate installed (HTTPS)
- ✅ Firewall configured (only ports 80, 443, SSH open)
- ✅ Strong SESSION_SECRET in .env
- ✅ serviceAccountKey.json has restricted permissions (600)
- ✅ Environment variables not exposed in client code

## 🔄 Post-Migration User Flow

### For Existing Users (from Replit)

**Important:** Users who signed up via Replit Auth cannot automatically log in with Firebase Auth because they're different systems.

**Options:**

1. **Fresh Start (Recommended):**
   - Existing users will need to sign up again with Google
   - Their old data (favorites, reviews) will be preserved in Firestore
   - You can manually link accounts if needed

2. **Manual Account Linking:**
   - Export user emails from migrated data
   - Invite them to sign up with Google
   - Use Firebase Admin SDK to merge their data

### For New Users

- Click "Log in" button
- Sign in with Google
- Automatic account creation in Firestore
- Seamless experience

## 🎯 Testing Checklist

After deployment, test:

- ✅ Homepage loads correctly
- ✅ Tools directory shows all 26 tools
- ✅ Articles page shows all 11 articles with images
- ✅ Google Sign-In works
- ✅ Admin panel accessible (only for you)
- ✅ Can create new articles
- ✅ Can favorite tools
- ✅ Can submit reviews
- ✅ Search functionality works
- ✅ Chatbot works (if using OpenAI)

## 📊 Monitoring

**Firebase Console:**
- Monitor Firestore usage: https://console.firebase.google.com/
- Check Authentication users
- Review security rules logs

**Server Monitoring:**
```bash
# With PM2
pm2 monit

# View logs
pm2 logs lungiverse

# Check status
pm2 status
```

## 🔧 Troubleshooting

### Issue: Migration script fails

**Solution:**
```bash
# Check DATABASE_URL is set to production
echo $DATABASE_URL

# Verify Firebase service account path
ls -la firebase-config/serviceAccountKey.json

# Re-run with verbose logging
NODE_ENV=development tsx scripts/migrate-to-firestore.ts
```

### Issue: "Unauthorized" when accessing admin panel

**Solution:**
```bash
# Verify your Firebase account has isAdmin custom claim
# Check in Firebase Console > Authentication > Users > Your user
# Or set it via script:
firebase auth:set-custom-user-claims <your-uid> '{"isAdmin":true}'
```

### Issue: Articles/Tools not loading

**Solution:**
- Check Firestore security rules deployed
- Verify collections exist in Firebase Console
- Check browser console for CORS errors
- Ensure API calls include Firebase ID token

### Issue: Google Sign-In not working

**Solution:**
- Verify lungiverse.com is in Firebase Console > Authentication > Settings > Authorized domains
- Check firebaseConfig in client/src/lib/firebase.ts
- Ensure SSL is enabled (HTTPS required for auth)

## 📞 Support

If you encounter issues:

1. Check Firebase Console for error logs
2. Review server logs: `pm2 logs lungiverse`
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

## 🎉 Success!

Once everything is working:
- Your site is live at https://lungiverse.com
- You have full control over hosting and data
- Firebase handles scaling automatically
- You can manage everything offline

**Next Steps:**
- Setup regular Firestore backups
- Configure Google Analytics
- Setup monitoring alerts
- Document your custom workflows
