import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminDb } from "./_lib/firebaseAdmin";

// This is the ONLY place in the whole app allowed to set premium status.
// It is never called by your frontend directly. It should only be called by
// your payment provider's webhook (Stripe, Chapa, Telebirr, etc.) after a
// real, verified payment succeeds.
//
// HOW TO WIRE THIS UP FOR REAL:
// 1. Pick a payment provider and get their webhook signing secret.
// 2. Replace the `verifyWebhookSecret` check below with that provider's real
//    signature verification (e.g. Stripe's `stripe.webhooks.constructEvent`).
// 3. Set PREMIUM_WEBHOOK_SECRET in Vercel env vars for now as a placeholder
//    shared-secret so nobody except you can call this endpoint while you
//    build out the real integration.
// 4. Point your payment provider's webhook URL at:
//    https://yourapp.vercel.app/api/premium-webhook

function verifyWebhookSecret(req: VercelRequest): boolean {
  const secret = req.headers["x-webhook-secret"];
  return !!secret && secret === process.env.PREMIUM_WEBHOOK_SECRET;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!verifyWebhookSecret(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { uid, isPremium, plan } = req.body || {};

  if (!uid || typeof isPremium !== "boolean") {
    return res.status(400).json({ error: "Missing required parameters: uid, isPremium" });
  }

  try {
    await adminDb.collection("entitlements").doc(uid).set(
      {
        isPremium,
        plan: plan || null,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Failed to update entitlement:", error);
    return res.status(500).json({ error: "Failed to update entitlement" });
  }
}
