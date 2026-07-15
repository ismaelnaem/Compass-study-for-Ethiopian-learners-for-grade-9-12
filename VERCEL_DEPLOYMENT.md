# Vercel Deployment Guide for Compass Study AI

## Step-by-Step Vercel Deployment

### 1. **Connect Your GitHub Repository**
- Go to https://vercel.com
- Click "Add New Project"
- Select your GitHub repo
- Click "Import"

### 2. **Configure Environment Variables**
In the Vercel dashboard, go to **Settings > Environment Variables** and add every variable listed in `ENV.md` / `SECRETS-FILL-ME-IN.txt`, using your own real values. Never commit real values to this file or any file in the repo.

### 3. **Build Configuration**
Make sure these settings are configured:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. **Deploy**
- Click "Deploy"
- Vercel will automatically build and deploy your app
- Wait for the build to complete (2-5 minutes)

### 5. **Verify Deployment**
Once deployed:
- Click the deployment URL to open your app
- Check that Gemini API calls work
- Verify Firebase connection is established

## Environment Variables Explanation

| Variable | Purpose |
|----------|----------|
| `GEMINI_API_KEY` | Powers the AI lesson generation & AI coach |
| `VITE_FIREBASE_API_KEY` | Firebase API authentication |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase authentication domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `NODE_ENV` | Set to `production` for deployment |

## Troubleshooting

### "Build failed"
- Check that all environment variables are set correctly
- Check for typos in variable names

### "API key error"
- Verify `GEMINI_API_KEY` is exactly correct
- Check for extra spaces or quotes
- Make sure you copied the full key

### "Firebase connection failed"
- Verify all `VITE_FIREBASE_*` variables are correct
- Check that Firebase project is active
- Ensure all credentials are from the same Firebase project

### "Module not found"
- Make sure `npm install` ran successfully
- Check that `package-lock.json` is committed
- Try clearing Vercel cache and redeploying

## After Deployment

Your app will automatically redeploy when you:
- Push to GitHub main branch
- Update environment variables in Vercel
