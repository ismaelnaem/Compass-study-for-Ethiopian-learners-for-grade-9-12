import { auth } from "../lib/firebase";

// Checks the CURRENT user's Firebase ID token for the "dev" custom claim.
// This is safe to trust for showing/hiding UI (like a "Dev Dashboard"
// button) because custom claims are baked into the signed token by
// Firebase itself — a user cannot edit their own claims client-side,
// unlike a field in their Firestore profile document.
//
// This only controls what's SHOWN in the UI. The actual dashboard data and
// actions are separately protected server-side via requireDevAuth() +
// the dashboard password — this check alone is not the security boundary.
export async function checkIsDevAccount(): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;
  try {
    const tokenResult = await user.getIdTokenResult();
    return tokenResult.claims.role === "dev";
  } catch {
    return false;
  }
}
