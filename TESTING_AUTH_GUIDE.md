# Authentication Testing Guide

Complete guide to test the new Firebase authentication system.

---

## ✅ What Was Fixed

1. **Replaced old Replit Auth** with **Firebase Authentication**
2. **Added dedicated `/login` page** with two sign-in options:
   - Google Sign-In (one-click)
   - Email/Password (traditional form)
3. **Fixed Header** to show logged-in user correctly
4. **Fixed Favorites** redirect (was going to 404, now goes to `/login`)
5. **Fixed Admin Panel** to use Firebase auth

---

## 🧪 Testing Checklist

### Step 1: Enable Email/Password Auth in Firebase

**IMPORTANT:** You must enable this first!

1. Go to: https://console.firebase.google.com/project/lungiverse-75fe3/authentication/providers
2. Click **"Email/Password"** provider
3. Toggle **"Email/Password"** to **ON**
4. Click **"Save"**

---

### Step 2: Test Email/Password Sign Up

1. **Go to** `http://localhost:5000`
2. **Click "Sign In"** button in header
3. You'll be redirected to `/login`
4. **Click "Sign Up" tab**
5. **Fill in the form:**
   - Full Name: `Lungisani Msibi`
   - Email: `LuhMsibi@gmail.com`
   - Password: `Lungisani` (or any password 6+ characters)
6. **Click "Create Account"**

**Expected Result:**
- ✅ Toast notification: "Account created! Welcome to Lungiverse"
- ✅ Redirected to homepage (`/`)
- ✅ Header shows your name "Lungisani Msibi" (or first part of email if no name)
- ✅ Profile avatar shows your initials "LM"
- ✅ "Sign In" button is now replaced with profile dropdown

---

### Step 3: Test Sign Out

1. **Click your profile avatar** in the header
2. **Click "Log out"**

**Expected Result:**
- ✅ Toast notification: "Signed out"
- ✅ Header shows "Sign In" button again
- ✅ User state is cleared

---

### Step 4: Test Email/Password Sign In

1. **Click "Sign In"** button
2. Stay on **"Sign In" tab**
3. **Enter your credentials:**
   - Email: `LuhMsibi@gmail.com`
   - Password: `Lungisani`
4. **Click "Sign In"**

**Expected Result:**
- ✅ Toast notification: "Welcome back! Successfully signed in"
- ✅ Redirected to homepage
- ✅ Header shows your profile

---

### Step 5: Test Google Sign-In

1. **Log out** (if logged in)
2. **Click "Sign In"** button
3. **Click "Continue with Google"** button
4. **Select your Google account** in the popup

**Expected Result:**
- ✅ Google auth popup appears
- ✅ After selecting account: redirected to homepage
- ✅ Header shows your Google profile picture and name
- ✅ Toast notification shows success

---

### Step 6: Test Favorites Feature (Auth Required)

1. **Make sure you're logged in**
2. **Go to** `/tools` page
3. **Click the heart icon** on any tool card

**Expected Result:**
- ✅ Toast notification: "Added to favorites"
- ✅ Heart icon turns filled/red
- ✅ Click again: "Removed from favorites"

**If NOT logged in:**
- ✅ Clicking heart redirects to `/login` page (not 404!)

---

### Step 7: Test Favorites Page

1. **While logged in**, add a few tools to favorites
2. **Go to** `/favorites` page

**Expected Result:**
- ✅ All your favorited tools are displayed
- ✅ Can remove tools from favorites
- ✅ Empty state if no favorites

**If NOT logged in:**
- ✅ Shows "Access Denied - Please log in"

---

### Step 8: Test Admin Panel (Admin Only)

1. **Make yourself admin** (see instructions below)
2. **Go to** `/admin`

**Expected Result:**
- ✅ Admin panel loads successfully
- ✅ Can see "Add Tool", "Add Article", "Manage Articles" tabs
- ✅ Can add new tools and articles

**If NOT admin:**
- ✅ Shows "Forbidden - You do not have admin privileges"

---

### Step 9: Test User Persistence

1. **Log in** with email/password or Google
2. **Refresh the page** (F5 or Ctrl+R)

**Expected Result:**
- ✅ You remain logged in after refresh
- ✅ Header still shows your profile
- ✅ No need to log in again

---

### Step 10: Test Mobile Menu

1. **Resize browser window** to mobile size (or use DevTools)
2. **Click hamburger menu icon** (three lines)
3. **Check user section** at bottom of menu

**Expected Result (Logged In):**
- ✅ Shows your avatar and name
- ✅ Shows "Log out" button

**Expected Result (NOT Logged In):**
- ✅ Shows "Sign In" button
- ✅ Clicking it goes to `/login`

---

## 🔧 How to Make Yourself Admin

### Method 1: Firebase Console (Easiest)

1. **Sign up/login** with your email on the app first
2. Go to: https://console.firebase.google.com/project/lungiverse-75fe3/firestore/data
3. Click **"users"** collection
4. Find your user document (search by email)
5. Click the document → Click **"Add field"**
   - Field name: `isAdmin`
   - Type: `boolean`
   - Value: `true`
6. Click **"Update"**
7. **Refresh the app** - you now have admin access!

### Method 2: Run Script in Firebase Console

1. Go to: https://console.firebase.google.com/project/lungiverse-75fe3
2. Click **"Firestore Database"** → **"Rules"** tab
3. Open browser DevTools (F12)
4. Go to **Console** tab
5. Paste and run:

```javascript
const db = firebase.firestore();
db.collection('users')
  .where('email', '==', 'LuhMsibi@gmail.com')
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      doc.ref.update({ isAdmin: true });
      console.log('Admin access granted!');
    });
  });
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Sign in with email/password failed"

**Solution:** Make sure you enabled Email/Password auth in Firebase Console (Step 1 above)

---

### Issue 2: "Sign In button still showing after login"

**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Or open in incognito/private window
- This was the main bug we just fixed!

---

### Issue 3: "Favorites redirects to 404"

**Solution:** This has been fixed! Should now redirect to `/login` instead.

---

### Issue 4: "Google Sign-In popup blocked"

**Solution:**
- Allow popups for localhost in browser settings
- Or try in a different browser
- Or use Email/Password signin instead

---

### Issue 5: "Admin panel shows 'Forbidden'"

**Solution:**
- Make sure you set `isAdmin: true` in Firestore (see instructions above)
- Refresh the page after updating Firestore
- Check that you're logged in with the correct account

---

## 📊 Expected User Flow

```
User visits site
   ↓
Clicks "Sign In" button
   ↓
Redirected to /login page
   ↓
Chooses sign-in method:
├── Google Sign-In → Popup → Success → Redirect to /
└── Email/Password → Form → Success → Redirect to /
   ↓
Header shows user profile
   ↓
User can:
├── Add tools to favorites
├── View favorites page
├── Access admin panel (if admin)
└── Sign out
```

---

## ✨ What's Different from Before

| Before | After |
|--------|-------|
| Used Replit Auth | Uses Firebase Auth |
| Popup login only | Dedicated login page |
| Google only | Google + Email/Password |
| Auth state not persisting | Persists after refresh |
| `/api/login` (404 error) | `/login` (works!) |
| `useAuth()` from authUtils | `useFirebaseAuth()` hook |
| Backend session-based | Firebase ID token-based |

---

## 🎯 Success Criteria

All of these should work:

- ✅ Can sign up with email/password
- ✅ Can sign in with email/password
- ✅ Can sign in with Google
- ✅ User stays logged in after page refresh
- ✅ Header shows correct user name and avatar
- ✅ Can add/remove favorites (when logged in)
- ✅ Favorites button redirects to `/login` (not 404)
- ✅ Admin panel accessible to admins only
- ✅ Can sign out successfully
- ✅ Mobile menu works correctly

---

**Happy Testing! 🚀**

If you encounter any issues, check the browser console (F12) for error messages.
