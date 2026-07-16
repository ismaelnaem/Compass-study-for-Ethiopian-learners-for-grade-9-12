import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "./_lib/auth";
import { initiatePayment, getPaymentConfig } from "./_lib/payment";

// Called when a user taps "Upgrade" on a paywall screen. Requires login —
// you must know who's paying before starting a checkout. Currently returns
// a clear "not configured" response until a real provider is wired in via
// api/_lib/payment.ts (see the instructions there).
export default async function handler(req: VercelRequest, res: VercelResponse) {
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
