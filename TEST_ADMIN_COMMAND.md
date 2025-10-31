# Working Command to Make Yourself Admin

## Step 1: Verify You're Logged In

Open browser console (F12) and run:

```javascript
// Check if Firebase user exists
const currentUser = firebase.auth().currentUser;
if (currentUser) {
  console.log("✅ Logged in as:", currentUser.email);
  console.log("Firebase UID:", currentUser.uid);
} else {
  console.log("❌ NOT LOGGED IN - Please sign in first!");
}
```

## Step 2: Make Yourself Admin (WITH TOKEN)

If you see "✅ Logged in", run this command:

```javascript
// Get Firebase ID token and call make-me-admin
firebase.auth().currentUser.getIdToken()
  .then(token => {
    console.log("🔑 Got token, calling endpoint...");
    return fetch('/api/auth/make-me-admin', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  })
  .then(res => res.json())
  .then(data => {
    console.log('✅ Response:', data);
    if (data.success) {
      alert('You are now admin! SIGN OUT and SIGN BACK IN for it to take effect.');
    } else {
      console.error('❌ Failed:', data);
    }
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });
```

## Step 3: Sign Out and Sign Back In

**CRITICAL:** The admin claim only works on NEW tokens!

1. Click your profile avatar → "Log out"
2. Click "Sign In"  
3. Sign in with the SAME account

## Step 4: Verify Admin Access

1. Go to: `http://localhost:5000/admin`
2. Should see admin panel (no more "Forbidden"!)

---

## If It Still Doesn't Work

Run this diagnostic:

```javascript
// Debug: Check if token is being sent
firebase.auth().currentUser.getIdToken()
  .then(token => {
    console.log("Token length:", token.length);
    console.log("Token preview:", token.substring(0, 50) + "...");
    
    // Test the /api/auth/user endpoint
    return fetch('/api/auth/user', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  })
  .then(res => res.json())
  .then(data => {
    console.log("User data from API:", data);
  })
  .catch(err => console.error("Error:", err));
```

This will tell us if the token is working properly.
