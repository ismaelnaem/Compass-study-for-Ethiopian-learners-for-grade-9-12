# How to Get Compass Study Online — Full Beginner Guide

This assumes you've never done this before. Every step is exact —
follow them in order. If anything looks different from what's
described, stop and tell me what you see instead of guessing.

**Heads up:** steps 1–3 below (creating the GitHub repo and
uploading files) are much easier from a computer than from a
phone, because you need to select a whole folder at once. If you
can borrow a computer for 15 minutes (library, cybercafe, a
friend), do these steps there. Everything after that (Vercel) works
fine on a phone.

---

## PART 1 — Create your GitHub account and repository

1. Go to https://github.com and tap **Sign up** (skip if you already have an account).
2. Once logged in, tap the **+** icon (top right) → **New repository**.
3. Repository name: `compass-study` (or anything you like — no spaces).
4. Set it to **Private** (keeps your code hidden from the public — recommended for now).
5. Do NOT check any of the boxes for README/gitignore/license — leave them unchecked, since we already have our own files.
6. Tap **Create repository**.

You'll land on an empty repository page with some setup instructions — ignore those, we're doing it a simpler way below.

---

## PART 2 — Upload your code

1. Unzip the file I gave you (`compass-study-current.zip`) on your computer, so you have a plain folder called `compass` with all the files inside it.
2. Back on your new GitHub repository page, click **uploading an existing file** (it's a blue link near the middle of the page).
3. Open the unzipped `compass` folder, select **everything inside it** (all files and folders — not the outer `compass` folder itself, just what's inside it), and drag that selection into the browser window.
4. Wait for the upload bar to finish (this can take a few minutes — there are a lot of files).
5. Scroll down, and where it says "Commit changes," just tap **Commit changes** with the default message.

Your code is now on GitHub.

**Double-check before moving on:** open the file list on GitHub and make sure `SECRETS-FILL-ME-IN.txt` and `.env` are **not** in there. They shouldn't be — `.gitignore` blocks them automatically — but it's worth a 10-second look since this file holds real credentials once you fill it in.

---

## PART 3 — Connect Vercel

1. Go to https://vercel.com and log in (or sign up — "Continue with GitHub" is the easiest option, it links the two automatically).
2. Click **Add New...** → **Project**.
3. Find your `compass-study` repository in the list and click **Import**.
4. Vercel will auto-detect the settings (Framework: Vite, Build Command: `npm run build`, Output: `dist`) — leave these as they are.
5. **Don't click Deploy yet** — first go to Part 4 below.

---

## PART 4 — Add your secrets to Vercel (the ONLY place they should go)

1. Still on that same import screen, find the section called **Environment Variables**.
2. Open `SECRETS-FILL-ME-IN.txt` (the one you filled in) side-by-side if you can.
3. For each line in that file, e.g. `GEMINI_API_KEY = abc123`:
   - In Vercel's "Name" box, type: `GEMINI_API_KEY`
   - In Vercel's "Value" box, paste: `abc123` (your real value, no extra spaces)
   - Click **Add**
4. Repeat for every single line in `SECRETS-FILL-ME-IN.txt` — all 13 of them (`GEMINI_API_KEY`, all 6 `VITE_FIREBASE_*` ones, `FIREBASE_SERVICE_ACCOUNT_KEY`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `PREMIUM_WEBHOOK_SECRET`, `DEV_DASHBOARD_PASSWORD`, `PAYMENT_PROVIDER`, `NODE_ENV`). Leave `PAYMENT_API_KEY` blank.
5. Once all of them are added, click **Deploy**.
6. Wait 2–5 minutes. If it says "Build failed" instead of "Congratulations," don't worry — copy the red error text and send it to me, I'll tell you exactly what's wrong.

---

## PART 5 — One-time Supabase setup

This only needs to be done once, ever:

1. Go to https://supabase.com/dashboard → your project.
2. On the left sidebar, click **SQL Editor**.
3. Click **New query**.
4. Open the file `supabase/setup.sql` from your project folder, copy everything in it, and paste it into that query box.
5. Click **Run**.

This creates the two tables Compass Study needs for storing AI-generated content. You'll only ever need to do this once.

---

## You're done

Once Part 4 finishes with "Congratulations," Vercel gives you a live web address (something like `compass-study-xyz.vercel.app`) — that's your app, live on the internet. Every time you want to update the code after this, upload the changed files to GitHub the same way as Part 2, and Vercel will automatically redeploy on its own.

If anything breaks at any point — a failed build, a blank screen, an error message — send it to me exactly as you see it (a screenshot is perfect) and I'll fix it.
