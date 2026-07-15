import { GoogleGenAI } from "@google/genai";

// Initialize Gemini SDK lazily so a missing key doesn't crash the function on cold start
let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Tries several Gemini models in order, in case one is over quota (429) or unavailable
export async function generateContentWithFallback(ai: GoogleGenAI, params: any, customModels?: string[]) {
  const models = customModels || ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  let firstError: any = null;
  for (const model of models) {
    try {
      const requestConfig = { ...(params.config || {}) };
      delete requestConfig.thinkingConfig;

      const response = await ai.models.generateContent({
        ...params,
        model: model,
        config: requestConfig,
      });
      return response;
    } catch (err: any) {
      console.warn(`[Gemini Fallback] Model ${model} failed:`, err?.message || err);
      if (!firstError) firstError = err;
    }
  }
  throw firstError || new Error("All requested models failed fallback checks.");
}

// Cleans AI-generated text before it's ever shown to a student.
//
// Why this exists: math/science subjects occasionally come back from
// Gemini (or get mangled during JSON parsing/repair) with corrupted
// runs of punctuation/symbol characters instead of the intended Unicode
// math notation (√, ², ₂, Σ, etc.) — this is a defense-in-depth pass
// that removes stray control characters, and detects (rather than
// silently ships) suspicious "garbage runs" of symbol characters that
// don't belong in normal educational text.
//
// Returns { text, wasCorrupted } — callers can log/flag when corruption
// was detected, since that's a signal the source generation should
// probably be retried rather than shown as-is.
export function sanitizeAIText(input: string): { text: string; wasCorrupted: boolean } {
  if (!input) return { text: input, wasCorrupted: false };

  let text = input;
  let wasCorrupted = false;

  // Strip stray control characters (0x00-0x1F except \n \t, and 0x7F) —
  // these are never legitimate in displayed text and are a common
  // fingerprint of a JSON-escaping or encoding mishap.
  const controlCharPattern = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
  if (controlCharPattern.test(text)) {
    wasCorrupted = true;
    text = text.replace(controlCharPattern, "");
  }

  // Detect "garbage runs": 4+ consecutive noise characters that aren't
  // normal math notation. Legitimate math uses symbols like √ Σ π × ÷ ² ₂
  // individually or in short, meaningful combinations (e.g. "x²+3"), not
  // long unbroken runs like "&%%#*#%@*%#*@££#*". Currency/punctuation
  // symbols that commonly show up in encoding-corruption noise (£ € ¥ ¢
  // § ± ¬ ¦ © ®) are included here specifically — legitimate math symbols
  // are deliberately NOT in this character class, so real formulas are
  // never touched even when they appear close together.
  const garbageRunPattern = /[!@#$%^&*_+=<>~`|\\£€¥¢§±¬¦©®]{4,}/gu;
  if (garbageRunPattern.test(text)) {
    wasCorrupted = true;
    text = text.replace(garbageRunPattern, "");
  }

  // Unpaired UTF-16 surrogates (half of a broken multi-byte character) —
  // these render as a visible replacement glyph or nothing at all, and
  // can happen if a response got truncated mid-character.
  const unpairedSurrogatePattern = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g;
  if (unpairedSurrogatePattern.test(text)) {
    wasCorrupted = true;
    text = text.replace(unpairedSurrogatePattern, "");
  }

  return { text: text.trim(), wasCorrupted };
}

// Recursively sanitizes every string value in an object/array — used to
// clean an entire lesson or quiz payload in one pass without having to
// manually touch every field.
export function sanitizeAIPayload<T>(payload: T): { data: T; wasCorrupted: boolean } {
  let anyCorrupted = false;

  function walk(value: any): any {
    if (typeof value === "string") {
      const { text, wasCorrupted } = sanitizeAIText(value);
      if (wasCorrupted) anyCorrupted = true;
      return text;
    }
    if (Array.isArray(value)) {
      return value.map(walk);
    }
    if (value && typeof value === "object") {
      const out: any = {};
      for (const key of Object.keys(value)) {
        out[key] = walk(value[key]);
      }
      return out;
    }
    return value;
  }

  const data = walk(payload);
  return { data, wasCorrupted: anyCorrupted };
}

// Robustly parses JSON text that Gemini sometimes wraps in markdown fences or leaves slightly malformed
export function parseCleanJson(text: string): any {
  let cleaned = text.trim();

  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring("```json".length);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring("```".length);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - "```".length);
  }
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    try {
      let temp = cleaned;
      temp = temp.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match, p1) => {
        return '"' + p1.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t") + '"';
      });
      temp = temp.replace(/,(\s*[\]}])/g, "$1");
      return JSON.parse(temp);
    } catch (err1) {
      const startIdx = cleaned.indexOf("{");
      const endIdx = cleaned.lastIndexOf("}");
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        try {
          let salvaged = cleaned.substring(startIdx, endIdx + 1);
          salvaged = salvaged.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match, p1) => {
            return '"' + p1.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t") + '"';
          });
          salvaged = salvaged.replace(/,(\s*[\]}])/g, "$1");
          return JSON.parse(salvaged);
        } catch (nestedErr) {
          throw err;
        }
      }
      throw err;
    }
  }
}
