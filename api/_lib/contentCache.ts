// Generated-content cache, backed by Supabase (see supabase.ts for why).
// Same "generate once, reuse forever" rule as before — this just moves
// WHERE new cached content lives, to keep Firestore's quota free for
// actual account data.

import { supabase } from "./supabase";

export type CachedContentType = "lesson" | "quiz" | "explanation" | "translation";

interface CacheRow {
  cache_key: string;
  content_type: CachedContentType;
  content: unknown;
  language: string;
  created_at?: string;
}

// Reads from the cache. Returns null on a miss OR if Supabase is
// unreachable — callers should treat both the same way (fall through to
// generating fresh content), never let a cache outage block a student.
export async function getCachedContent(cacheKey: string): Promise<unknown | null> {
  try {
    const { data, error } = await supabase
      .from("content_cache")
      .select("content")
      .eq("cache_key", cacheKey)
      .maybeSingle();

    if (error || !data) return null;
    return data.content;
  } catch (err) {
    console.error("Supabase cache read failed (non-fatal, treating as cache miss):", err);
    return null;
  }
}

// Writes to the cache. Failures here are logged but never thrown — a
// caching write failing should never break the response the student
// already has in hand.
export async function setCachedContent(
  cacheKey: string,
  contentType: CachedContentType,
  content: unknown,
  language: string
): Promise<void> {
  try {
    const row: CacheRow = {
      cache_key: cacheKey,
      content_type: contentType,
      content,
      language,
    };
    const { error } = await supabase.from("content_cache").upsert(row, {
      onConflict: "cache_key",
    });
    if (error) {
      console.error("Supabase cache write failed (non-fatal):", error);
    }
  } catch (err) {
    console.error("Supabase cache write failed (non-fatal):", err);
  }
}

// ===== Quiz question bank =====
// Replaces the old Firestore `questionBank` collection, which was the
// single biggest contributor to Firestore's 1GB quota. Same idea, moved
// to Supabase's larger free tier. Failures here are non-fatal for the
// same reason as above — a quiz should still generate even if the bank
// read/write has a hiccup.

export interface BankQuestion {
  question: string;
  options: string[];
  answer_index: number;
  explanation: string;
  subject: string;
  grade: string;
  unit?: string;
  sub_unit: string;
  language: string;
}

export async function addQuestionsToBank(questions: BankQuestion[]): Promise<void> {
  if (questions.length === 0) return;
  try {
    const { error } = await supabase.from("question_bank").insert(questions);
    if (error) console.error("Supabase question_bank insert failed (non-fatal):", error);
  } catch (err) {
    console.error("Supabase question_bank insert failed (non-fatal):", err);
  }
}

export async function getQuestionsFromBank(
  subject: string,
  grade: string,
  subUnit: string,
  limit = 100
): Promise<BankQuestion[]> {
  try {
    const { data, error } = await supabase
      .from("question_bank")
      .select("*")
      .eq("subject", subject)
      .eq("grade", grade)
      .eq("sub_unit", subUnit)
      .limit(limit);

    if (error || !data) return [];
    return data as BankQuestion[];
  } catch (err) {
    console.error("Supabase question_bank read failed (non-fatal, treating as empty):", err);
    return [];
  }
}
