// One-time setup script — run this yourself, once, to make the very first
// Dev account (yours) before anyone has the "dev" role yet. After this,
// use the Dev Dashboard's "Add Dev" feature (api/admin/grant-dev-role.ts)
// for every dev after the first one — you won't need this script again.
//
// HOW TO RUN:
//   1. Make sure you have your service account JSON saved locally
//      (the same file used for FIREBASE_SERVICE_ACCOUNT_KEY).
//   2. Sign up for a real Compass Study account first (through the app),
//      using the email you want as your dev login.
//   3. Run:
//        node scripts/bootstrap-first-dev.mjs /path/to/serviceAccountKey.json your@email.com
//
// This talks directly to Firebase Auth via the Admin SDK — it does not
// go through the deployed app or any API endpoint, since no dev exists yet
// to authorize that call.

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";

const [, , serviceAccountPath, email] = process.argv;

if (!serviceAccountPath || !email) {
  console.error(
    "Usage: node scripts/bootstrap-first-dev.mjs /path/to/serviceAccountKey.json your@email.com"
  );
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

initializeApp({ credential: cert(serviceAccount) });

const auth = getAuth();

try {
  const user = await auth.getUserByEmail(email);
  const existingClaims = user.customClaims || {};
  await auth.setCustomUserClaims(user.uid, { ...existingClaims, role: "dev" });
  console.log(`Done. ${email} (uid: ${user.uid}) now has Dev Dashboard access.`);
  console.log("Log out and back in on that account for it to take effect.");
} catch (err) {
  console.error("Failed:", err.message);
  console.error(
    "Make sure this account already signed up in the app once before running this script."
  );
  process.exit(1);
}
