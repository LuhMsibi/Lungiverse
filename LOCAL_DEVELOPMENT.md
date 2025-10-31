# 💻 Local Development Guide (Windows)

This guide shows you **exactly** how to develop Lungiverse on your Windows machine.

---

## ✅ Prerequisites

- Windows 10/11
- Node.js 18+ installed ([Download](https://nodejs.org/))
- Git installed ([Download](https://git-scm.com/))
- VS Code or your favorite editor
- Your Firebase credentials

---

## 🚀 One-Time Setup

### Step 1: Clone the Repository

```bash
# Open Command Prompt or PowerShell
cd C:\Users\YourName\Projects

# Clone your repo
git clone https://github.com/YOUR_USERNAME/lungiverse.git
cd lungiverse
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create `.env` File

Create a file called `.env` in the root directory:

```env
# Firebase Admin SDK (Backend)
FIREBASE_PROJECT_ID=lungiverse-75fe3
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xy79e@lungiverse-75fe3.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1Z9jRl+YOUR_ACTUAL_KEY_HERE
-----END PRIVATE KEY-----
"

# Development
NODE_ENV=development
PORT=5000

# Session Secret
SESSION_SECRET=dev-secret-key-change-in-production
```

**Get your Firebase Private Key:**
1. Open `attached_assets/lungiverse-75fe3-firebase-adminsdk-xy79e-0ab9bb5c85.json`
2. Copy the entire `private_key` value
3. Paste it in your `.env` file

**Save the file!**

---

## 🎯 Daily Development Workflow

### Start Development Server

```bash
# Start the app (frontend + backend)
npm run dev
```

**That's it!** Your app is now running at:
- Frontend: http://localhost:5000
- API: http://localhost:5000/api

### Making Changes

1. **Edit code** in VS Code or your editor
2. **Save the file** - changes auto-reload!
3. **Refresh browser** to see changes

### Common Commands

```bash
# Start development server
npm run dev

# Build for production (test your build)
npm run build

# Run production build locally
npm start

# Check for TypeScript errors
npx tsc --noEmit
```

---

## 📝 Development Workflow Example

**Scenario:** You want to add a new feature

```bash
# 1. Make sure you're on latest code
git pull

# 2. Create a feature branch (optional but recommended)
git checkout -b feature/my-new-feature

# 3. Start development server
npm run dev

# 4. Make your changes in VS Code
# - Edit files in client/src/ for frontend
# - Edit files in server/ for backend

# 5. Test your changes at http://localhost:5000

# 6. Commit your changes
git add .
git commit -m "Add my new feature"

# 7. Push to GitHub
git push origin feature/my-new-feature
```

---

## 🗂️ Project Structure

```
lungiverse/
├── client/                 # Frontend React app
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       ├── lib/            # Firebase, queryClient
│       └── hooks/          # useFirebaseAuth, etc.
│
├── server/                 # Backend Express app
│   ├── routes.ts           # API endpoints
│   ├── firestoreStorage.ts # Database operations
│   ├── firebaseAuth.ts     # Auth middleware
│   └── firebaseAdmin.ts    # Firebase Admin SDK
│
├── shared/                 # Shared types/schemas
│   └── schema.ts           # Data models
│
├── attached_assets/        # Static assets
│   └── lungiverse-*.json   # Firebase credentials
│
├── .env                    # YOUR environment variables (NOT in git)
├── package.json            # Dependencies & scripts
└── vite.config.ts          # Vite configuration
```

---

## 🔧 Common Development Tasks

### Adding a New Page

1. Create component in `client/src/pages/MyNewPage.tsx`
2. Add route in `client/src/App.tsx`:
```typescript
<Route path="/my-page" component={MyNewPage} />
```

### Adding an API Endpoint

1. Open `server/routes.ts`
2. Add new endpoint:
```typescript
app.get("/api/my-endpoint", async (req, res) => {
  // Your code here
  res.json({ message: "Hello!" });
});
```

### Adding Data to Firestore

1. Go to Firebase Console → Firestore Database
2. Select your collection (tools, articles, etc.)
3. Click "Add Document"
4. Fill in the fields
5. Save

---

## 🐛 Troubleshooting

### Port 5000 already in use

```bash
# Windows: Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Then start again
npm run dev
```

### Firebase auth not working locally

1. Check your `.env` file has correct credentials
2. Make sure `FIREBASE_PRIVATE_KEY` is properly formatted
3. Restart the dev server (Ctrl+C, then `npm run dev`)

### Changes not appearing

1. Hard refresh browser: `Ctrl+Shift+R` or `Ctrl+F5`
2. Check console for errors: `F12` → Console tab
3. Restart dev server: `Ctrl+C`, then `npm run dev`

### "Module not found" errors

```bash
# Re-install dependencies
npm install
```

---

## 🚀 Deploy Your Changes

### When ready to deploy to production:

```bash
# 1. Commit your changes
git add .
git commit -m "Describe your changes"

# 2. Push to GitHub
git push

# 3. SSH into your server
ssh your-username@your-server-ip

# 4. Update on server
cd /var/www/lungiverse
git pull
npm install
npm run build
pm2 restart lungiverse

# 5. Check it works
pm2 logs lungiverse
```

**Visit https://lungiverse.com to see your changes live!**

---

## ✅ Development Checklist

Before pushing code:

- [ ] Code runs locally without errors
- [ ] Tested main features still work
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Committed all changes
- [ ] Wrote clear commit message

---

## 💡 Pro Tips

1. **Use Git branches** for new features
2. **Test locally first** before pushing
3. **Commit often** with clear messages
4. **Pull before pushing** to avoid conflicts
5. **Check logs** if something breaks: `pm2 logs lungiverse`

---

## 📚 Useful Resources

- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Firebase Docs](https://firebase.google.com/docs)
- [Wouter (Routing)](https://github.com/molefrog/wouter)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🎉 You're Ready!

You now know how to:
- ✅ Set up local development
- ✅ Make changes to the code
- ✅ Test changes locally
- ✅ Deploy to production

**Happy coding!** 🚀
