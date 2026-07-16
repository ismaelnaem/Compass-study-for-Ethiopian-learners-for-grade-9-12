import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireDevAuth } from "../_lib/auth";
import { adminAuth } from "../_lib/firebaseAdmin";

// Lets an existing Dev add another Dev account, entirely from inside the
// Dev Dashboard UI — no code changes or manual Firebase Console work needed
// for every new dev going forward. Only callable by someone who already has
// the "dev" custom claim themselves.
export default async function handler(req: VercelRequest, res: VercelResponse) {
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
