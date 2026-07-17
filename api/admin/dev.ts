import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireDevAuth } from "../_lib/auth";
import { adminAuth } from "../_lib/firebaseAdmin";

// Merged from the old separate api/verify-dev-password.ts and
// api/admin/grant-dev-role.ts endpoints to stay under Vercel Hobby's
// 12-Serverless-Function-per-deployment limit. Pick which one you want
// with body.action = "verify-password" or "grant-role".
//
// Both actions require the "dev" custom claim (requireDevAuth) — this is
// set server-side only, a client can never grant this to itself.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireDevAuth(req, res);
  if (!decoded) return; // requireDevAuth already sent 401/403

  const { action, password, targetUid, targetEmail } = req.body || {};

  if (action === "verify-password") {
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

  if (action === "grant-role") {
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

  return res.status(400).json({ error: "Missing or invalid parameter: action must be 'verify-password' or 'grant-role'" });
}
