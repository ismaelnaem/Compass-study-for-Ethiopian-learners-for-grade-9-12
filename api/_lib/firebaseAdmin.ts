import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// On Vercel there is no "Application Default Credentials" like there is on Google Cloud.
// So we must give firebase-admin a Service Account key explicitly, via an environment variable.
function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. See deployment guide."
    );
  }
  return JSON.parse(raw);
}

if (!getApps().length) {
  initializeApp({
    credential: cert(getServiceAccount()),
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  });
}

// Uses the default Firestore database for your dedicated Compass project
// (compass-study-24788), not the old AI Studio scratch project's
// non-default database ID that this used to point to.
export const adminDb = getFirestore();
export const adminAuth = getAuth();
