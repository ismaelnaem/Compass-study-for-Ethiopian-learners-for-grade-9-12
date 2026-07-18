import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "./_lib/auth";
import { adminDb } from "./_lib/firebaseAdmin";
import { getUserRole, getUserDisplayName, getOrCreateCompassId, lookupUidByCompassId } from "./_lib/connections";
import { FieldValue } from "firebase-admin/firestore";

// Merged endpoint: combines create-class, get-my-id, list-connections,
// request-connection, and respond-connection into ONE Vercel Function to
// stay under the Hobby plan's 12-function cap. Routed internally by an
// `_fn` query parameter — see vercel.json for the URL rewrites that keep
// the original public paths (e.g. /api/list-connections) working exactly
// as before. Each branch below is the unmodified logic from the original
// standalone file.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const fn = String(req.query._fn || "");

  switch (fn) {
    case "create-class":
      return createClass(req, res);
    case "get-my-id":
      return getMyId(req, res);
    case "list-connections":
      return listConnections(req, res);
    case "request-connection":
      return requestConnection(req, res);
    case "respond-connection":
      return respondConnection(req, res);
    default:
      return res.status(404).json({ error: "Unknown connections endpoint." });
  }
}

// ---------- create-class ----------
async function createClass(req: VercelRequest, res: VercelResponse) {
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

// ---------- get-my-id ----------
async function getMyId(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

  try {
    const [compassId, role] = await Promise.all([
      getOrCreateCompassId(uid),
      getUserRole(uid),
    ]);
    return res.status(200).json({ compassId, role });
  } catch (error) {
    console.error("Error fetching Compass ID:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

// ---------- list-connections ----------
async function listConnections(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

  async function withStudentSnapshot(connections: any[]) {
    return Promise.all(
      connections.map(async (c: any) => {
        if (c.status !== "accepted") return c;
        const studentSnap = await adminDb.collection("users").doc(c.studentId).get();
        const d = studentSnap.data() || {};
        return {
          ...c,
          studentName: d.profile?.name || "Student",
          studentGrade: d.profile?.grade || null,
          streak: d.stats?.streak || 0,
          quizHighScores: d.stats?.quizHighScores || {},
          weakSubjects: d.profile?.memory?.weakSubjects || [],
          strongSubjects: d.profile?.memory?.strongSubjects || [],
        };
      })
    );
  }

  try {
    const role = await getUserRole(uid);

    if (role === "student") {
      const snap = await adminDb.collection("connections").where("studentId", "==", uid).get();
      const connections = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return res.status(200).json({ role, connections });
    }

    if (role === "teacher") {
      const [connSnap, classSnap] = await Promise.all([
        adminDb.collection("connections").where("initiatorId", "==", uid).where("type", "==", "teacher-student").get(),
        adminDb.collection("classes").where("teacherId", "==", uid).get(),
      ]);
      const raw = connSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const connections = await withStudentSnapshot(raw);
      const classes = classSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return res.status(200).json({ role, connections, classes });
    }

    if (role === "family") {
      const snap = await adminDb.collection("connections").where("initiatorId", "==", uid).where("type", "==", "family-student").get();
      const raw = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const connections = await withStudentSnapshot(raw);
      return res.status(200).json({ role, connections });
    }

    return res.status(200).json({ role: null, connections: [] });
  } catch (error) {
    console.error("Error listing connections:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

// ---------- request-connection ----------
async function requestConnection(req: VercelRequest, res: VercelResponse) {
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

// ---------- respond-connection ----------
async function respondConnection(req: VercelRequest, res: VercelResponse) {
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
