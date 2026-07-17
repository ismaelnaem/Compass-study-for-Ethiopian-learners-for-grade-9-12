// ===== Payment Provider Configuration =====
//
// This is the ONE place that needs to change when you're ready to turn on
// real payments. Right now it's a clearly-labeled placeholder — nothing
// here charges real money yet.
//
// HOW TO ACTIVATE THIS LATER:
// 1. Pick a provider (Telebirr direct, a specific bank, or an aggregator
//    like Chapa/SantimPay that covers Telebirr + banks + cards in one API).
// 2. Set these two environment variables in Vercel:
//      PAYMENT_PROVIDER=telebirr   (or "bank", "chapa", etc.)
//      PAYMENT_API_KEY=your-real-key-here
// 3. Come back to this file (and its sibling `initiatePayment` function
//    below) and we'll fill in that provider's actual request format
//    together — every provider expects a different shape here, so this
//    is intentionally left as a clear TODO rather than a guess.

export interface PaymentConfig {
  provider: string | null;
  apiKey: string | null;
  isConfigured: boolean;
}

export function getPaymentConfig(): PaymentConfig {
  const provider = process.env.PAYMENT_PROVIDER || null;
  const apiKey = process.env.PAYMENT_API_KEY || null;
  return {
    provider,
    apiKey,
    isConfigured: !!provider && !!apiKey,
  };
}

export interface InitiatePaymentParams {
  uid: string;
  plan: "individual" | "family" | "school";
  amountBirr: number;
  billingCycle: "monthly" | "yearly";
  // For school plan: how many students/teachers this covers, since pricing
  // is per-seat (see pricing rules in the architecture doc).
  seatCount?: number;
}

export interface InitiatePaymentResult {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}

// Stub — intentionally not implemented yet. Returns a clear, honest error
// instead of pretending to charge someone. Replace the body of this
// function with the real provider's "create payment/checkout" API call
// once PAYMENT_PROVIDER and PAYMENT_API_KEY are set for real.
export async function initiatePayment(
  params: InitiatePaymentParams
): Promise<InitiatePaymentResult> {
  const config = getPaymentConfig();

  if (!config.isConfigured) {
    return {
      success: false,
      error:
        "Payments are not configured yet. Set PAYMENT_PROVIDER and PAYMENT_API_KEY to enable real checkout.",
    };
  }

  // TODO (build together once a provider is chosen):
  //   const response = await fetch(providerCheckoutEndpoint, {
  //     method: "POST",
  //     headers: { Authorization: `Bearer ${config.apiKey}` },
  //     body: JSON.stringify({ ...provider-specific fields... }),
  //   });
  //   return { success: true, checkoutUrl: response.checkout_url };

  return {
    success: false,
    error: `Provider "${config.provider}" is set, but the actual checkout request hasn't been wired up yet.`,
  };
}
