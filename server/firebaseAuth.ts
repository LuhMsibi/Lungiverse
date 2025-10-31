/**
 * Firebase Authentication Middleware
 * Replaces Replit Auth - verifies Firebase ID tokens and manages user sessions
 */

import { Request, Response, NextFunction } from "express";
import { auth } from "./firebaseAdmin";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string | null | undefined;
    isAdmin: boolean;
  };
}

/**
 * Middleware to verify Firebase ID token
 * Attaches user info to req.user if valid
 */
export async function verifyFirebaseToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = undefined;
      return next();
    }

    const idToken = authHeader.split("Bearer ")[1];

    // Verify the token
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      isAdmin: decodedToken.isAdmin === true, // Custom claim
    };

    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    req.user = undefined;
    next();
  }
}

/**
 * Middleware to require authentication
 * Returns 401 if user is not authenticated
 */
export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized - Please log in" });
  }
  next();
}

/**
 * Middleware to require admin privileges
 * Returns 403 if user is not an admin
 */
export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized - Please log in" });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Forbidden - Admin access required" });
  }

  next();
}

/**
 * Set custom admin claim for a user (called from admin endpoint)
 */
export async function setAdminClaim(uid: string, isAdmin: boolean = true) {
  try {
    await auth.setCustomUserClaims(uid, { isAdmin });
    console.log(`✅ Admin claim set for user ${uid}: ${isAdmin}`);
    return true;
  } catch (error) {
    console.error(`❌ Error setting admin claim for user ${uid}:`, error);
    throw error;
  }
}
