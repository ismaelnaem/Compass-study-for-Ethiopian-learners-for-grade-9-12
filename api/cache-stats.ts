import type { VercelRequest, VercelResponse } from "@vercel/node";

// NOTE: Your original server.ts cached lessons/quizzes to a local JSON file on disk.
// Vercel serverless functions don't have a persistent disk (each request can run on a
// fresh instance), so that kind of caching doesn't work here. This endpoint now just
// returns empty/zero stats so your DevDashboard component doesn't break.
export default function handler(req: VercelRequest, res: VercelResponse) {
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
