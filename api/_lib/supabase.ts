// Supabase — used ONLY as an overflow cache for AI-generated content
// (lessons, quizzes, explanations), to protect Firestore's 1GB quota.
// Firebase/Firestore remains the source of truth for everything serious:
// auth, student accounts, IDs, entitlements. Never put account data here.
//
// This client uses the SECRET key and must only ever run server-side
// (inside /api functions) — never imported into frontend code.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { persistSession: false },
});
