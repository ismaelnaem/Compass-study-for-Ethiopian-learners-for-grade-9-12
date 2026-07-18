import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "./_lib/auth";
import { getOrCreateCompassId, getUserRole } from "./_lib/connections";

// Powers the "Your Compass ID (share this with your teacher or family)"
// screen. Also returns the caller's role so the frontend knows which
// connection UI to show (a Student sees their ID to share; a Teacher/Family
// member sees the "enter someone's ID" form instead).
export default async function handler(req: VercelRequest, res: VercelResponse) {
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
