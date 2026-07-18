// Shared helpers for the class/connection/consent system.
//
// Design (locked in the Connection Data Model + Permission System docs):
//   - Every student has a short, shareable "Compass ID" (not their long
//     Firebase uid) that a Teacher or Family member types in to start a
//     connection request.
//   - A connection is NEVER created directly by either side — it always
//     starts as a pending request from a Teacher/Family and must be
//     explicitly accepted by the Student. This is the consent-gating rule
//     (locked decision #7): no auto-connect, ever.
//   - Firestore rules for `classes`, `connections`, and `compassIds` are
//     all `allow read, write: if false` — every access goes through these
//     server endpoints (Admin SDK bypasses rules), so permission logic
//     stays centralized in one place instead of duplicated in security
//     rules AND in application code.

import { adminDb } from "./firebaseAdmin";

export type UserRole = "student" | "teacher" | "family" | null;

const ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I — avoids look-alike mistakes when a student reads their ID aloud or copies it by hand

function randomCompassId(): string {
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)];
  }
  return id;
}

// Returns the user's existing Compass ID, or creates one if they don't have
// one yet. Safe to call every time — it's a no-op read after the first call.
export async function getOrCreateCompassId(uid: string): Promise<string> {
  const userRef = adminDb.collection("users").doc(uid);
  const userSnap = await userRef.get();
  const existing = userSnap.data()?.compassId;
  if (existing) return existing;

  // Retry on the (very unlikely) chance of a collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = randomCompassId();
    const indexRef = adminDb.collection("compassIds").doc(candidate);
    const indexSnap = await indexRef.get();
    if (indexSnap.exists) continue;

    await indexRef.set({ uid });
    await userRef.set({ compassId: candidate }, { merge: true });
    return candidate;
  }
  throw new Error("Could not generate a unique Compass ID after 5 attempts.");
}

// Looks up which uid owns a given Compass ID. Returns null if it doesn't exist.
export async function lookupUidByCompassId(compassId: string): Promise<string | null> {
  const snap = await adminDb.collection("compassIds").doc(compassId.toUpperCase().trim()).get();
  if (!snap.exists) return null;
  return snap.data()?.uid ?? null;
}

// Reads the user's role. Returns null if they haven't set one yet — role
// selection isn't part of onboarding yet, so existing accounts may not have
// this set. Callers should treat null as "not eligible" rather than guessing.
export async function getUserRole(uid: string): Promise<UserRole> {
  const snap = await adminDb.collection("users").doc(uid).get();
  const role = snap.data()?.role;
  if (role === "student" || role === "teacher" || role === "family") return role;
  return null;
}

export async function getUserDisplayName(uid: string): Promise<string> {
  const snap = await adminDb.collection("users").doc(uid).get();
  return snap.data()?.profile?.name || snap.data()?.name || "Someone";
    }
