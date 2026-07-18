import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "./_lib/auth";
import { adminDb } from "./_lib/firebaseAdmin";
import { getUserRole, getUserDisplayName } from "./_lib/connections";

// Every role sees a different slice of `connections` — this is the one
// place that decides what's returned, matching the "centralize permission
// logic" principle so it isn't duplicated in every screen. A Student sees
// requests addressed to them (pending + accepted). A Teacher/Family member
// sees only requests THEY sent. Nobody sees anyone else's requests.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

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
      const connections = connSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const classes = classSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return res.status(200).json({ role, connections, classes });
    }

    if (role === "family") {
      const snap = await adminDb.collection("connections").where("initiatorId", "==", uid).where("type", "==", "family-student").get();
      const connections = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const withNames = await Promise.all(
        connections.map(async (c: any) => ({
          ...c,
          studentName: c.status === "accepted" ? await getUserDisplayName(c.studentId) : null,
        }))
      );
      return res.status(200).json({ role, connections: withNames });
    }

    return res.status(200).json({ role: null, connections: [] });
  } catch (error) {
    console.error("Error listing connections:", error);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
