# Lungiverse - Self-Hosted Migration Package

**Complete Firebase Migration from Replit** - Everything you need to run Lungiverse on your own infrastructure.

## 🎯 What's Included

This package contains your complete Lungiverse application ready for self-hosting:

- ✅ Full React frontend (Vite + TypeScript)
- ✅ Express backend with Firebase integration
- ✅ Migration script (PostgreSQL → Firestore)
- ✅ Firebase Authentication (Google Sign-In)
- ✅ All 26 AI tools
- ✅ All 11 articles with Unsplash images
- ✅ Admin panel
- ✅ Complete documentation

## ⚡ Quick Start

### 1. Run Migration Script

**Important:** Do this FIRST to migrate your data from Replit to Firebase:

```bash
# Make sure DATABASE_URL points to Replit's PRODUCTION database
# Then run:
tsx scripts/migrate-to-firestore.ts
```

**Expected output:**
```
🚀 Starting Lungiverse Migration: PostgreSQL → Firestore
============================================================
📦 Migrating users...
✅ Users: 15/15 migrated
📦 Migrating tools...
✅ Tools: 26/26 migrated
📦 Migrating articles...
✅ Articles: 11/11 migrated
...
✅ Migration completed successfully!
```

### 2. Local Development

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Firebase credentials

# Start development server
npm run dev
```

Visit http://localhost:5000

### 3. Production Deployment

```bash
# Build application
npm run build

# Start production server
npm start
```

## 📚 Documentation

- **MIGRATION_GUIDE.md** - Complete migration instructions
- **DEPLOYMENT.md** - Detailed deployment guide for various hosting options
- **FIRESTORE_SCHEMA.md** - Database structure documentation
- **firestore.rules** - Security rules for Firebase

## 🔑 Important Files

### Firebase Configuration

```
firebase-config/
├── serviceAccountKey.json     # Your Firebase service account (PROVIDED)
└── firebase.config.js         # Frontend Firebase config (PROVIDED)
```

### Environment Setup

Create `.env` file in root directory:

```env
SESSION_SECRET=your-random-string-here
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-config/serviceAccountKey.json
DOMAIN=lungiverse.com
NODE_ENV=production
PORT=5000
```

## 🛠️ Key Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build            # Build frontend + backend
npm start                # Start production server

# Migration
tsx scripts/migrate-to-firestore.ts  # Migrate data to Firestore

# Type checking
npm run check            # TypeScript type checking
```

## 🔒 Security Setup

### 1. Deploy Firestore Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (if needed)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

### 2. Set Admin Access

Edit `scripts/migrate-to-firestore.ts` line 410 and uncomment:

```typescript
await setAdminClaim("your-email@gmail.com");
```

Or set via Firebase Console:
- Go to Authentication → Users → Your user → Custom claims
- Add: `{ "isAdmin": true }`

## 🚀 Deployment Options

### Option 1: Simple VPS (Recommended)

1. **Upload to server:**
```bash
scp -r . user@your-server:/path/to/lungiverse
```

2. **Install & build:**
```bash
npm install
npm run build
```

3. **Use PM2:**
```bash
npm install -g pm2
pm2 start dist/index.js --name lungiverse
pm2 save
pm2 startup
```

4. **Setup NGINX** (see DEPLOYMENT.md)

5. **Get SSL certificate:**
```bash
sudo certbot --nginx -d lungiverse.com
```

### Option 2: Docker

```bash
docker build -t lungiverse:latest .
docker run -d -p 5000:5000 --env-file .env lungiverse:latest
```

See **DEPLOYMENT.md** for detailed instructions for various hosting platforms.

## 🗂️ Project Structure

```
lungiverse/
├── client/                       # React frontend
│   ├── src/
│   │   ├── components/          # UI components
│   │   ├── pages/               # Pages
│   │   ├── lib/
│   │   │   ├── firebase.ts      # Firebase client config
│   │   │   └── apiClient.ts     # API client with auth
│   │   └── hooks/
│   │       └── useFirebaseAuth.tsx  # Auth hook
│
├── server/                       # Express backend
│   ├── index.ts                 # Server entry
│   ├── routes.ts                # API routes
│   ├── firebaseAdmin.ts         # Firebase Admin SDK
│   ├── firebaseAuth.ts          # Auth middleware
│   └── firestoreStorage.ts      # Database operations
│
├── firebase-config/              # Firebase credentials
│   ├── serviceAccountKey.json   # Admin SDK key
│   └── firebase.config.js       # Web app config
│
├── scripts/
│   └── migrate-to-firestore.ts  # Migration script
│
├── .env.example                 # Environment template
├── firestore.rules              # Security rules
├── MIGRATION_GUIDE.md           # Migration guide
├── DEPLOYMENT.md                # Deployment guide
└── FIRESTORE_SCHEMA.md          # Database schema
```

## ✅ Migration Checklist

- [ ] Run migration script
- [ ] Verify data in Firebase Console
- [ ] Deploy Firestore security rules
- [ ] Set admin custom claim
- [ ] Configure `.env` file
- [ ] Test locally (`npm run dev`)
- [ ] Build application (`npm run build`)
- [ ] Deploy to production
- [ ] Setup NGINX reverse proxy
- [ ] Get SSL certificate
- [ ] Test production site
- [ ] Add domain to Firebase authorized domains

## 📊 What Gets Migrated

From Replit PostgreSQL to Firebase Firestore:

| Collection | Description | Count |
|------------|-------------|-------|
| users | User accounts | All users |
| tools | AI tools directory | 26 tools |
| articles | Blog articles | 11 articles |
| favorites | User favorites | All favorites |
| reviews | Tool reviews | All reviews |
| searchHistory | Search logs | All searches |
| analyticsEvents | Analytics data | All events |
| contactMessages | Contact form | All messages |

## 🔄 Authentication Changes

**Before (Replit):**
- Replit OAuth
- Automatic account creation
- Session-based auth

**After (Firebase):**
- Google Sign-In only
- Manual first-time signup
- Token-based auth

**Important:** Existing users will need to sign up again with Google. Their old data (favorites, reviews) is preserved but linked to new Firebase Auth UIDs.

## 🎯 Features

- ✅ 250+ AI tools across 6 categories
- ✅ Advanced search functionality
- ✅ User authentication (Google Sign-In)
- ✅ Favorites system
- ✅ Review and rating system
- ✅ SEO-optimized articles
- ✅ Admin panel for content management
- ✅ AI chatbot (if OpenAI configured)
- ✅ Fully responsive design
- ✅ Dark mode support

## 🐛 Troubleshooting

### Migration fails

```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Verify Firebase credentials
cat firebase-config/serviceAccountKey.json | jq .project_id

# Run with verbose logging
NODE_ENV=development tsx scripts/migrate-to-firestore.ts
```

### Can't access admin panel

```bash
# Set admin claim manually
firebase auth:set-custom-user-claims <your-uid> '{"isAdmin":true}'
```

### Application won't start

```bash
# Check Node version (need 18+)
node --version

# Check build output
ls -la dist/

# Check environment
cat .env
```

See **DEPLOYMENT.md** for complete troubleshooting guide.

## 📞 Support

All documentation is included:

1. **MIGRATION_GUIDE.md** - Step-by-step migration
2. **DEPLOYMENT.md** - Hosting and deployment
3. **FIRESTORE_SCHEMA.md** - Database structure

## 🎉 Success Criteria

Your migration is successful when:

- ✅ Migration script completes without errors
- ✅ All data visible in Firebase Console
- ✅ Local site runs at localhost:5000
- ✅ Google Sign-In works
- ✅ Admin panel accessible (you only)
- ✅ Production site live at your domain
- ✅ SSL certificate active (HTTPS)
- ✅ All tools and articles display correctly

## 🚨 Important Notes

1. **Database:** No PostgreSQL needed - Firebase Firestore handles all data
2. **Authentication:** Firebase Auth only (no Replit Auth)
3. **Credentials:** Keep `serviceAccountKey.json` secure - never commit to Git
4. **Environment:** Always use `.env` for sensitive data
5. **Backups:** Setup automatic Firestore backups in Firebase Console

## 📈 Next Steps After Migration

1. Setup monitoring (UptimeRobot, etc.)
2. Configure automatic backups
3. Setup analytics (Google Analytics)
4. Add custom domain email forwarding
5. Document your workflows
6. Plan content strategy

---

**You now have complete control over your application!** 🎉

Everything runs on your infrastructure with Firebase handling the database. You can modify, extend, and manage Lungiverse entirely offline.

Need help? Check the documentation files included in this package.
