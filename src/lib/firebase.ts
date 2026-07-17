import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getAuth, GoogleAuthProvider, signInWithRedirect, signInWithPopup, getRedirectResult,
  signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Reads Firebase config from environment variables (see ENV.md).
const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: metaEnv.VITE_FIREBASE_APP_ID || ""
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Uses the default Firestore database for the dedicated Compass project,
// not the old AI Studio scratch project's non-default database ID.
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
// Set default parameters for Google sign in if desired
googleProvider.setCustomParameters({
  prompt: "select_account"
});

export {
  app, auth, db, googleProvider, signInWithRedirect, signInWithPopup, getRedirectResult,
  signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail,
};
