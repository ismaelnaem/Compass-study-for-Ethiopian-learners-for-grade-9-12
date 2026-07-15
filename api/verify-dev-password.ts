import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireDevAuth } from "./_lib/auth";

// Two layers before the Dev Dashboard unlocks, matching the product spec:
//   1. The account must have the "dev" custom claim (requireDevAuth) —
//      this is set server-side only, a client can never grant this to itself.
//   2. A password, checked here against DEV_DASHBOARD_PASSWORD (server env
//      var, never sent to the client, never present in any JS bundle).
//
// Biometric (fingerprint) is intended as an additional client-side
// convenience step before even attempting this call (WebAuthn) — that's a
// separate, larger piece of work (registering a device credential) and
// isn't wired up yet. Role + password is the real, working security
// boundary right now; biometric on top of that is a later UX layer, not
// a replacement for it.
export default async function handler(req: VercelRequest, res: VercelResponse) {
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
