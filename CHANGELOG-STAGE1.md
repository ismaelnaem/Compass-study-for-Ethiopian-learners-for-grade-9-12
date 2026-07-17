# Compass Study — Stage 1 Build Notes

This is Stage 1 of the staged rebuild: fixing what was broken/insecure and
wiring in your real content, so there's a working, honest demo foundation
before we build the new role-based features (teacher/family dashboards,
consent flows, payments) on top of it.

## Fixed

- **Broken entry point** — `index.html` pointed to `/src/main.tsx`, which
  didn't exist (files were nested under `src/components/`). The app would
  not have loaded at all. Fixed by flattening the folder structure to match
  what the docs already described: `src/screens/`, `src/lib/`, `src/utils/`,
  `src/curriculum-data/`.
- **Critical security hole** — every AI-calling endpoint (`generate-lesson`,
  `generate-quiz`, `chat-coach`, `check-understanding`, `translate-lesson`,
  `tts`) now requires a real, server-verified login. `uid` is read only from
  the verified Firebase token (`requireAuth` in `api/_lib/auth.ts`) — never
  from the request body, which anyone could previously spoof or omit
  entirely to get unlimited free Gemini calls at your expense.
- **Premium bypass removed from the security model's blast radius** — the
  webhook (`premium-webhook.ts`) was already correct; the endpoints above
  now consistently defer to the same locked `entitlements` collection via
  `checkQuota`, not any client-editable field.
- **Hardcoded admin password removed** — the `/admin` chat command that
  unlocked the Dev Dashboard via a password visible in the JS bundle has
  been deleted. The dashboard is intentionally unreachable until real
  role-based access (Firebase custom claim + password + optional biometric)
  is built in Stage 2 — better an honest "not built yet" than a fake lock.
- **Dead files removed**: `TodoApp.tsx` (unrelated leftover),
  `cloudflare-worker.js` (contradicted the Vercel architecture),
  `firebase-applet-config.json` (see note below), all root-level scratch
  files (`test*.js`, `print_tree.*`, `tree.txt`, old curriculum extraction
  scripts), and the empty `package-lock.json`.
- **Two corrupted filenames fixed**: `assets/brand.` → `assets/brand_identity.json`,
  `assets/gitignore` → `assets/.gitignore` (both had lost their proper names/extension).
- **Rebranding**: "FIYIT" replaced with "Compass Study" across UI strings,
  console log prefixes, localStorage keys (`fiyit_*` → `compass_*`),
  Firestore field names (`fiyit_user_profile_v2` → `compass_user_profile_v2`,
  etc.), and both README files.
- **Real curriculum data wired in** — `src/data.ts` is now generated from
  your actual Grade 9–12 content (41 subjects total, correct Natural/Social
  streams for 11–12). The source JSON/MJS files live in `/content-source`
  so you can hand-edit and regenerate later.
- **Real translations wired in** — `src/translations.ts` now has all 169
  keys (English/Amharic/Afaan Oromoo) from the finalized translation sheet,
  including everything for the not-yet-built teacher/family/consent screens.

## Not built yet (Stage 2+ — needs its own pass)

- Role selection at signup (Student/Teacher/Family), school-name capture
- Teacher Dashboard, Family Dashboard, consent-gated linking flow
- Real RBAC for Teacher/Dev dashboard access (replacing the removed hardcoded gate)
- Premium paywall UI for the three tiers + real payment provider integration
- Family–Teacher chat with report/block
- PWA installability polish + Android TWA wrapper
- Guest-mode UI (pre-built quiz bank without login, clear "log in to unlock AI" prompts)

## One thing flagged, not changed

- `firebase-applet-config.json` was **removed from this build**, not deleted
  from existence — it contained real, live credentials for an
  auto-provisioned Google AI Studio Firebase project (`lively-pipe-jd2jw`),
  unrelated to "Compass." You should decide whether to keep using that
  project or set up a dedicated Compass Firebase project — real credentials
  should come from you directly when we wire up Stage 2, not be carried
  forward from an old scratch project.
- The AI Coach's companion name is still **"Fiy"** in the system prompt —
  I didn't rename this since it's a persona/mascot decision, not just a
  brand string. Let me know if you want to keep it, rename it, or fold it
  into the Compass identity somehow.
