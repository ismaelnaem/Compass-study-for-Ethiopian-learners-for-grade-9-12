import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminAuth } from "./firebaseAdmin";

// Returns the decoded Firebase user if a valid "Authorization: Bearer <token>" header
// is present, otherwise returns null. Does NOT block the request by itself —
// callers that need a mandatory identity must use requireAuth() below instead.
export async function verifyAuth(req: VercelRequest) {
  const authHeader = req.headers.authorization;
  if (
    !authHeader ||
    Array.isArray(authHeader) ||
    !authHeader.startsWith("Bearer ") ||
    authHeader.trim() === "Bearer"
  ) {
    return null;
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    return await adminAuth.verifyIdToken(token);
  } catch (error) {
    console.error("Auth verification failed:", error);
    return null;
  }
}

// SECURITY: use this for any endpoint that must know who the caller is
// (quota checks, saving data under a uid, anything that costs money to run).
// The uid ALWAYS comes from the verified Firebase ID token — never from
// req.body, req.query, or any other client-supplied value. A client cannot
// spoof, omit, or choose its own uid this way.
//
// Returns the decoded token on success. On failure, it writes a 401 response
// to `res` itself and returns null — the caller should check for null and
// `return` immediately without doing any further work (including any AI call).
export async function requireAuth(
  req: VercelRequest,
  res: VercelResponse
): Promise<import("firebase-admin/auth").DecodedIdToken | null> {
  const decoded = await verifyAuth(req);
  if (!decoded) {
    res.status(401).json({
      error: "Authentication required. Please log in and try again.",
    });
    return null;
  }
  return decoded;
}

// SECURITY: use this for anything Dev-Dashboard-only.
//
// "Dev" is a Firebase custom claim (`role: "dev"`) set server-side via the
// Admin SDK — it can NEVER be set by a client, unlike a field in a
// Firestore profile document a user could edit. This replaces the old
// hardcoded chat-command password, which shipped the password inside the
// public JS bundle for anyone to read.
//
// This checks the role claim only. Call sites that also need the extra
// password step (unlocking the dashboard for a session) should additionally
// call verifyDevPassword() — see api/verify-dev-password.ts.
export async function requireDevAuth(
  req: VercelRequest,
  res: VercelResponse
): Promise<import("firebase-admin/auth").DecodedIdToken | null> {
  const decoded = await requireAuth(req, res);
  if (!decoded) return null; // requireAuth already sent the 401

  if (decoded.role !== "dev") {
    res.status(403).json({
      error: "This account does not have Dev Dashboard access.",
    });
    return null;
  }
  return decoded;
}
