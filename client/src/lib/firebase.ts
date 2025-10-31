/**
 * Firebase Client SDK Configuration
 * Used for frontend authentication and Firestore access
 */

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCarn-n4va3zSbhz9CKoLPPwczW1_F1H-U",
  authDomain: "lungiverse-75fe3.firebaseapp.com",
  projectId: "lungiverse-75fe3",
  storageBucket: "lungiverse-75fe3.firebasestorage.app",
  messagingSenderId: "143992347551",
  appId: "1:143992347551:web:0f660a7ad83c957a173baa",
  measurementId: "G-MBBLKGNFDK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.addScope("profile");
googleProvider.addScope("email");

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    throw new Error(error.message || "Failed to sign in with Google");
  }
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    console.error("Error signing in with email:", error);
    if (error.code === "auth/user-not-found") {
      throw new Error("No account found with this email");
    } else if (error.code === "auth/wrong-password") {
      throw new Error("Incorrect password");
    } else if (error.code === "auth/invalid-email") {
      throw new Error("Invalid email address");
    }
    throw new Error(error.message || "Failed to sign in");
  }
}

/**
 * Sign up with Email and Password
 */
export async function signUpWithEmail(email: string, password: string, displayName: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    if (result.user && displayName) {
      await updateProfile(result.user, { displayName });
    }
    
    return result.user;
  } catch (error: any) {
    console.error("Error signing up with email:", error);
    if (error.code === "auth/email-already-in-use") {
      throw new Error("An account with this email already exists");
    } else if (error.code === "auth/weak-password") {
      throw new Error("Password should be at least 6 characters");
    } else if (error.code === "auth/invalid-email") {
      throw new Error("Invalid email address");
    }
    throw new Error(error.message || "Failed to create account");
  }
}

/**
 * Sign out
 */
export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("Error signing out:", error);
    throw new Error(error.message || "Failed to sign out");
  }
}

/**
 * Get current user's ID token for API requests
 */
export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    return await user.getIdToken();
  } catch (error) {
    console.error("Error getting ID token:", error);
    return null;
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export default app;
