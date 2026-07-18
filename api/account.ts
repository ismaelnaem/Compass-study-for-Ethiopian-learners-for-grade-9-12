import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth, requireDevAuth } from "./_lib/auth";
import { adminDb, adminAuth } from "./_lib/firebaseAdmin";
import { getUserRole } from "./_lib/connections";

// Merged endpoint: combines set-role, verify-dev-password, and
// admin/grant-dev-role into ONE Vercel Function to stay under the Hobby
// plan's 12-function cap. Routed internally by an `_fn` query parameter —
// vercel.json rewrites keep the original public paths (e.g.
// /api/admin/grant-dev-role) working exactly as before.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const fn = String(req.query._fn || "");

  switch (fn) {
    case "set-role":
      return setRole(req, res);
    case "verify-dev-password":
      return verifyDevPassword(req, res);
    case "grant-dev-role":
      return grantDevRole(req, res);
    default:
      return res.status(404).json({ error: "Unknown account endpoint." });
  }
}

// ---------- set-role ----------
async function setRole(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

  const { role } = req.body || {};
  if (role !== "student" && role !== "teacher" && role !== "family") {
    return res.status(400).json({
      error: "Role must be one of: student, teacher, family.",
    });
  }

  const existingRole = await getUserRole(uid);
  if (existingRole) {
    return res.status(409).json({
      error: `This account is already set as ${existingRole}. Contact support to change it.`,
    });
  }

  try {
    await adminDb.collection("users").doc(uid).set({ role }, { merge: true });
    return res.status(200).json({ success: true, role });
  } catch (error) {
    console.error("Error setting role:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

// ---------- verify-dev-password ----------
async function verifyDevPassword(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireDevAuth(req, res);
  if (!decoded) return; // requireDevAuth already sent 401/403

  const { password } = req.body || {};
  const expected = process.env.DEV_DASHBOARD_PASSWORD;

  if (!expected) {
    return res.status(503).json({
      error: "DEV_DASHBOARD_PASSWORD is not configured on the server yet.",
    });
  }

  if (typeof password !== "string" || password !== expected) {
    return res.status(401).json({ error: "Incorrect password." });
  }

  return res.status(200).json({ success: true });
}

// ---------- grant-dev-role ----------
async function grantDevRole(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireDevAuth(req, res);
  if (!decoded) return;

  const { targetUid, targetEmail } = req.body || {};
  if (!targetUid && !targetEmail) {
    return res.status(400).json({ error: "Provide either targetUid or targetEmail." });
  }

  try {
    const targetUser = targetUid
      ? await adminAuth.getUser(targetUid)
      : await adminAuth.getUserByEmail(targetEmail);

    const existingClaims = targetUser.customClaims || {};
    await adminAuth.setCustomUserClaims(targetUser.uid, {
      ...existingClaims,
      role: "dev",
    });

    return res.status(200).json({
      success: true,
      message: `${targetUser.email || targetUser.uid} now has Dev Dashboard access. They may need to log out and back in for it to take effect.`,
    });
  } catch (error: any) {
    console.error("Failed to grant dev role:", error);
    return res.status(400).json({ error: "Couldn't find or update that account. Double-check the uid/email." });
  }
}
