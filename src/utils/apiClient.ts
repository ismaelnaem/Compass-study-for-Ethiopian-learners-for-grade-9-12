import { auth } from "../lib/firebase";

// Small shared wrapper matching the exact fetch + Bearer-token pattern
// already used in Progress.tsx / AICoach.tsx / LessonConcept.tsx, so the
// new Teacher/Family/Chat screens call the API the same way the rest of
// the app already does — nothing new to learn, no second convention.
export async function apiCall(
  path: string,
  options: { method?: "GET" | "POST"; body?: any } = {}
) {
  const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : "";
  const response = await fetch(path, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}
