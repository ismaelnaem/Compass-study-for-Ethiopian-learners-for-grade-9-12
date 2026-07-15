# Compass Study AI - Environment Configuration Guide

## For Local Development
1. Create a `.env` file in the root directory (same level as package.json)
2. Copy the values from `.env.example` or use your own Firebase project credentials
3. **NEVER commit `.env` to GitHub** - it's in .gitignore

## For Deployment (Vercel, Heroku, Railway, etc.)
Set these environment variables in your deployment platform's settings:

```
GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_SERVICE_ACCOUNT_KEY=paste_the_whole_service_account_json_as_one_line
PREMIUM_WEBHOOK_SECRET=a_random_string_only_you_know
PAYMENT_PROVIDER=none
PAYMENT_API_KEY=
DEV_DASHBOARD_PASSWORD=a_strong_password_only_devs_know
SUPABASE_URL=https://ncpifhocueoqrfbzuqxl.supabase.co
SUPABASE_SECRET_KEY=your_supabase_secret_key
NODE_ENV=production
```

## Supabase (content cache — quizzes, lessons, explanations)

Separate from Firebase on purpose: Firestore's free tier caps at 1GB,
which fills up fast from AI-generated content. Supabase's free tier gives
5GB, so it's used specifically as overflow cache for generated content —
never for accounts, auth, or anything Firestore already owns. Run
`supabase/setup.sql` once in the Supabase SQL Editor to create the tables
before this will work. Both tables have Row Level Security enabled with
no public policies — only the secret key (server-side only) can read or
write.

## Payments (not active yet)

Two variables control this:
- `PAYMENT_PROVIDER` — set to whichever provider you end up using (e.g. `telebirr`, `bank`, `chapa`). Leave as `none` until you're ready.
- `PAYMENT_API_KEY` — that provider's real API key, once you have one.

Until both are set, `/api/create-payment` returns an honest "not configured
yet" response instead of pretending to work. See `api/_lib/payment.ts` for
exactly where the real integration gets built once a provider is chosen.

## Dev Dashboard access

- `DEV_DASHBOARD_PASSWORD` — the password required (server-side only,
  never shipped to the client) to unlock the Dev Dashboard, in addition to
  the account needing the `dev` role. See `api/_lib/auth.ts` and
  `api/verify-dev-password.ts`.

## Getting Your API Keys

### Gemini API Key
- Go to: https://aistudio.google.com/apikey
- Create a new API key
- Copy and paste into GEMINI_API_KEY

### Firebase Credentials
- Go to: https://console.firebase.google.com
- Select your project
- Go to Project Settings (gear icon)
- Copy values from "Your apps" section under Web app config

## Security Notes
⚠️ **IMPORTANT:**
- Never expose your `.env` file publicly
- API keys should only be stored in environment variables
- Use `.gitignore` to prevent accidental commits
