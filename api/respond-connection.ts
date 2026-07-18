import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "./_lib/auth";
import { adminDb } from "./_lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

// Only the Student a request was sent TO can accept or decline it — never
// the initiator, and never anyone else. This is the one moment consent
// actually happens; everything downstream (Teacher/Family dashboards,
// chat) depends on this check being right.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

  const { connectionId, accept } = req.body || {};
  if (!connectionId || typeof accept !== "boolean") {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  try {
    const ref = adminDb.collection("connections").doc(connectionId);
    const snap = await ref.get();
    if (!snap.exists) {
      return res.status(404).json({ error: "That request no longer exists." });
    }
    const data = snap.data()!;

    if (data.studentId !== uid) {
      return res.status(403).json({ error: "This request isn't addressed to your account." });
    }
    if (data.status !== "pending") {
      return res.status(409).json({ error: "This request has already been responded to." });
    }

    await ref.update({
      status: accept ? "accepted" : "declined",
      respondedAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ success: true, status: accept ? "accepted" : "declined" });
  } catch (error) {
    console.error("Error responding to connection:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
