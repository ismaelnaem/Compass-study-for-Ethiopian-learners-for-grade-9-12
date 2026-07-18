import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "./_lib/auth";
import { adminDb } from "./_lib/firebaseAdmin";
import { getUserRole } from "./_lib/connections";

// Role selection isn't part of onboarding yet (see architecture gap notes),
// so this lets any screen (Profile, or a future onboarding step) let a user
// declare their role. Once set, a role can't be silently changed by the
// same call — this prevents a Student from re-labeling themselves as a
// Teacher to bypass the consent system. Changing an existing role requires
// a support request, not this endpoint.
export default async function handler(req: VercelRequest, res: VercelResponse) {
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
