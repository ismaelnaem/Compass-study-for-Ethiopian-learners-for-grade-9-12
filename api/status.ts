import type { VercelRequest, VercelResponse } from "@vercel/node";

// Merged from the old separate api/health.ts and api/cache-stats.ts endpoints
// to stay under Vercel Hobby's 12-Serverless-Function-per-deployment limit.
// Pick which one you want with ?type=health (default) or ?type=cache.
//
// NOTE: Your original server.ts cached lessons/quizzes to a local JSON file on disk.
// Vercel serverless functions don't have a persistent disk (each request can run on a
// fresh instance), so that kind of caching doesn't work here. The "cache" type below
// just returns empty/zero stats so your DevDashboard component doesn't break.
export default function handler(req: VercelRequest, res: VercelResponse) {
  const type = (req.query.type as string) || "health";

  if (type === "cache") {
    return res.status(200).json({
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

  return res.status(200).json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
}
