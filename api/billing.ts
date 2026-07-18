import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "./_lib/auth";
import { initiatePayment, getPaymentConfig } from "./_lib/payment";
import { adminDb } from "./_lib/firebaseAdmin";

// Merged endpoint: combines create-payment and premium-webhook into ONE
// Vercel Function to stay under the Hobby plan's 12-function cap. Routed
// internally by an `_fn` query parameter — vercel.json rewrites keep the
// original public paths (/api/create-payment, /api/premium-webhook)
// working exactly as before, including for external payment-provider
// webhooks pointed at /api/premium-webhook.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const fn = String(req.query._fn || "");

  switch (fn) {
    case "create-payment":
      return createPayment(req, res);
    case "premium-webhook":
      return premiumWebhook(req, res);
    default:
      return res.status(404).json({ error: "Unknown billing endpoint." });
  }
}

// ---------- create-payment ----------
// Called when a user taps "Upgrade" on a paywall screen. Requires login —
// you must know who's paying before starting a checkout. Currently returns
// a clear "not configured" response until a real provider is wired in via
// api/_lib/payment.ts (see the instructions there).
async function createPayment(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  const uid = decoded.uid;

  const { plan, billingCycle, seatCount } = req.body || {};

  if (!plan || !["individual", "family", "school"].includes(plan)) {
    return res.status(400).json({ error: "Missing or invalid parameter: plan" });
  }
  if (!billingCycle || !["monthly", "yearly"].includes(billingCycle)) {
    return res.status(400).json({ error: "Missing or invalid parameter: billingCycle" });
  }

  // Pricing per the locked business rules. School plan is priced per seat
  // (teachers + students covered), so seatCount is required for that plan.
  const MONTHLY_BIRR: Record<string, number> = {
    individual: 20,
    family: 25, // × number of children, applied via seatCount
    school: 15, // × teachers × students, applied via seatCount
  };
  const YEARLY_MULTIPLIER = 10; // placeholder: ~2 months free on annual, adjust when finalized

  const perSeat = MONTHLY_BIRR[plan];
  const seats = plan === "individual" ? 1 : Math.max(1, Number(seatCount) || 1);
  const monthlyTotal = perSeat * seats;
  const amountBirr = billingCycle === "yearly" ? monthlyTotal * YEARLY_MULTIPLIER : monthlyTotal;

  const result = await initiatePayment({ uid, plan, amountBirr, billingCycle, seatCount: seats });

  if (!result.success) {
    // Honest, not a fake success — tells you (or a curious user in dev)
    // exactly why nothing happened yet.
    const config = getPaymentConfig();
    return res.status(503).json({
      error: result.error,
      providerConfigured: config.isConfigured,
    });
  }

  return res.status(200).json({ checkoutUrl: result.checkoutUrl });
}

// ---------- premium-webhook ----------
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

async function premiumWebhook(req: VercelRequest, res: VercelResponse) {
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
