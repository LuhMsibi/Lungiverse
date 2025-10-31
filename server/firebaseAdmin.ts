/**
 * Firebase Admin SDK initialization
 * Used for server-side Firebase operations (authentication, Firestore access)
 */

import admin from "firebase-admin";

let firebaseApp: admin.app.App;

export function initializeFirebaseAdmin() {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // Initialize Firebase Admin with environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID || "lungiverse-75fe3";
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
      throw new Error(
        "Firebase credentials not found. Please set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables."
      );
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });

    console.log("✅ Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin SDK:", error);
    throw error;
  }

  return firebaseApp;
}

// Initialize on module load
initializeFirebaseAdmin();

// Export Firebase services
export const auth = admin.auth();
export const firestore = admin.firestore();
export const timestamp = admin.firestore.Timestamp;

export default admin;
