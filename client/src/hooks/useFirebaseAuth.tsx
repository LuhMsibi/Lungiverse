/**
 * Firebase Authentication Hook
 * Replaces useAuth - provides authentication state and methods
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { auth, signInWithGoogle as firebaseSignIn, signOut as firebaseSignOut, onAuthChange, getIdToken } from "@/lib/firebase";

interface AuthContextType {
  user: FirebaseUser | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Get ID token result to check custom claims
        const tokenResult = await firebaseUser.getIdTokenResult();
        setIsAdmin(tokenResult.claims.isAdmin === true);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await firebaseSignIn();
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut();
    } catch (error: any) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const getToken = async () => {
    return await getIdToken();
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useFirebaseAuth must be used within FirebaseAuthProvider");
  }
  return context;
}
