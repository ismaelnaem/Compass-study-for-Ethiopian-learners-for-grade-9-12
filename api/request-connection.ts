import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "./_lib/auth";
import { adminDb } from "./_lib/firebaseAdmin";
import { getUserRole, lookupUidByCompassId, getUserDisplayName } from "./_lib/connections";
import { FieldValue } from "firebase-admin/firestore";

// Consent-gating rule (locked decision #7, never changed): a Teacher or
// Family member can only ever REQUEST a connection. The Student must
// explicitly accept it via respond-connection.ts before either side can
// see anything about the other. Nothing here auto-connects anyone.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

  const initiatorRole = await getUserRole(uid);
  if (initiatorRole !== "teacher" && initiatorRole !== "family") {
    return res.status(403).json({
      error: "Only a Teacher or Family account can send a connection request.",
    });
  }

  const { targetCompassId, classId } = req.body || {};
  if (!targetCompassId || typeof targetCompassId !== "string") {
    return res.status(400).json({ error: "A Compass ID is required." });
  }
  if (initiatorRole === "teacher" && !classId) {
    return res.status(400).json({ error: "A class must be selected to invite a student." });
  }

  try {
    const studentUid = await lookupUidByCompassId(targetCompassId);
    if (!studentUid) {
      return res.status(404).json({ error: "We couldn't find that ID. Please check and try again." });
    }
    if (studentUid === uid) {
      return res.status(400).json({ error: "You can't connect to your own account." });
    }

    const studentRole = await getUserRole(studentUid);
    if (studentRole !== "student") {
      return res.status(400).json({ error: "That Compass ID doesn't belong to a Student account." });
    }

    // If teacher, confirm they actually own the class they're inviting into.
    let className: string | null = null;
    let schoolName: string | null = null;
    if (initiatorRole === "teacher") {
      const classSnap = await adminDb.collection("classes").doc(classId).get();
      const classData = classSnap.data();
      if (!classSnap.exists || classData?.teacherId !== uid) {
        return res.status(403).json({ error: "You don't have access to that class." });
      }
      className = classData?.className ?? null;
      schoolName = classData?.schoolName ?? null;
    }

    const type = initiatorRole === "teacher" ? "teacher-student" : "family-student";

    // Don't create a duplicate pending request for the same pair.
    const existing = await adminDb
      .collection("connections")
      .where("initiatorId", "==", uid)
      .where("studentId", "==", studentUid)
      .where("type", "==", type)
      .where("status", "==", "pending")
      .limit(1)
      .get();
    if (!existing.empty) {
      return res.status(200).json({ success: true, alreadyPending: true });
    }

    const initiatorName = await getUserDisplayName(uid);
    await adminDb.collection("connections").add({
      type,
      initiatorId: uid,
      initiatorRole,
      initiatorName,
      studentId: studentUid,
      classId: initiatorRole === "teacher" ? classId : null,
      className,
      schoolName,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      respondedAt: null,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error requesting connection:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
