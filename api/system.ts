import type { VercelRequest, VercelResponse } from "@vercel/node";

// Merged endpoint: combines health and cache-stats into ONE Vercel
// Function to stay under the Hobby plan's 12-function cap. Routed
// internally by an `_fn` query parameter — vercel.json rewrites keep the
// original public paths (/api/health, /api/cache-stats) working exactly
// as before.
export default function handler(req: VercelRequest, res: VercelResponse) {
  const fn = String(req.query._fn || "");

  switch (fn) {
    case "health":
      return health(req, res);
    case "cache-stats":
      return cacheStats(req, res);
    default:
      return res.status(404).json({ error: "Unknown system endpoint." });
  }
}

// ---------- health ----------
function health(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
}

// ---------- cache-stats ----------
// NOTE: Your original server.ts cached lessons/quizzes to a local JSON file on disk.
// Vercel serverless functions don't have a persistent disk (each request can run on a
// fresh instance), so that kind of caching doesn't work here. This endpoint now just
// returns empty/zero stats so your DevDashboard component doesn't break.
function cacheStats(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    usdSaved: 0,
    lessonsCachedCount: 0,
    quizzesCachedCount: 0,
    hitRatePercentage: 0,
    note: "Server-side caching is not available on Vercel serverless. This is a stub.",
  });
}
