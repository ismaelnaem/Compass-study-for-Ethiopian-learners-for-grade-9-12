import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "./_lib/auth";
import { adminDb } from "./_lib/firebaseAdmin";
import { getUserRole, getUserDisplayName } from "./_lib/connections";
import { FieldValue } from "firebase-admin/firestore";

// Only a Teacher can create a class (locked Connection Data Model: "A class
// belongs to one school, contains students + assigned teachers"). School
// name is free-text for now — no canonical school directory exists yet
// (a known, deliberately-deferred gap), so duplicate school names are
// expected and fine at this stage.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

  const role = await getUserRole(uid);
  if (role !== "teacher") {
    return res.status(403).json({ error: "Only a Teacher account can create a class." });
  }

  const { className, schoolName } = req.body || {};
  if (!className || typeof className !== "string" || !className.trim()) {
    return res.status(400).json({ error: "Class name is required." });
  }

  try {
    const teacherName = await getUserDisplayName(uid);
    const docRef = await adminDb.collection("classes").add({
      teacherId: uid,
      teacherName,
      className: className.trim(),
      schoolName: (schoolName || "").trim(),
      createdAt: FieldValue.serverTimestamp(),
    });
    return res.status(200).json({ success: true, classId: docRef.id });
  } catch (error) {
    console.error("Error creating class:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
