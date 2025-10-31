/**
 * Firebase Admin SDK initialization
 * Used for server-side Firebase operations (authentication, Firestore access)
 */

import admin from "firebase-admin";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let firebaseApp: admin.app.App;

export function initializeFirebaseAdmin() {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // Try to load service account from file (for local development and deployment)
    const serviceAccountPath = path.join(__dirname, "../firebase-config/serviceAccountKey.json");
    const serviceAccount = require(serviceAccountPath);

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: "lungiverse-75fe3",
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
