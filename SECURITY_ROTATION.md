# 🚨 URGENT: Credential Rotation Required

**Status:** Your `.env` file was committed to Git and pushed to GitHub. The credentials below were exposed.

## ✅ Completed Steps
- [x] Removed `.env` from Git tracking
- [x] Removed `.env` from entire Git history (all branches)
- [x] Cleaned up Git database

## 🔴 IMMEDIATE ACTION REQUIRED

### 1. OpenRouter API Key (CRITICAL)
**Status:** ❌ EXPOSED  
**Old Key:** `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`

**Steps to Rotate:**
1. Go to: https://openrouter.ai/keys
2. Delete the old key: `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`
3. Create a new API key
4. Copy the new key to `.env.local` as `OPENROUTER_API_KEY`

### 2. MongoDB Password (CRITICAL)
**Status:** ❌ EXPOSED  
**Old Password:** `GlqodeTsag6kwBaj`  
**Username:** `gonzalezandrew528_db_user`

**Steps to Rotate:**
1. Go to: https://cloud.mongodb.com/
2. Navigate to: Database Access → Database Users
3. Find user: `gonzalezandrew528_db_user`
4. Click "Edit" → "Edit Password"
5. Generate a new strong password
6. Update `.env.local` with new connection string:
   ```
   DATABASE_URL=mongodb+srv://gonzalezandrew528_db_user:NEW_PASSWORD@goloanme.yfgujyf.mongodb.net/?appName=GoLoanMe
   ```

### 3. Cloudinary API Secret (HIGH PRIORITY)
**Status:** ❌ EXPOSED (if it was in your .env file)  
**Cloud Name:** `dmh4epqqg`  
**API Key:** `663819948411382`

**Steps to Rotate:**
1. Go to: https://console.cloudinary.com/settings/security
2. Regenerate API Secret
3. Update `.env.local`:
   ```
   CLOUDINARY_API_SECRET=new_secret_here
   CLOUDINARY_URL=cloudinary://663819948411382:new_secret_here@dmh4epqqg
   ```

### 4. Auth0 Setup (NEW SETUP)
**Status:** ⚠️ NEEDS CONFIGURATION

**Steps:**
1. Go to: https://auth0.com/
2. Create a new tenant (or use existing)
3. Create a new Application → Regular Web Application
4. Enable Connections:
   - Database (email/password)
   - Google Social Login
5. Set Callback URLs:
   ```
   https://www.fundmebabyonemoretime.us/api/auth/callback
   http://localhost:3000/api/auth/callback
   ```
6. Copy credentials to `.env.local`:
   - Domain
   - Client ID
   - Client Secret
   - Audience

## 📝 Next Steps

### A. Create Your Local Environment File
```bash
cd /Users/andrewgonzalez/Desktop/BIANgit/rowdyhacks-2025
cp env.example .env.local
```
Then edit `.env.local` with your NEW credentials.

### B. Update Vercel Environment Variables
1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Delete all old environment variables
3. Add new variables from your `.env.local` (use production values)
4. Set `NODE_ENV=production`
5. Redeploy your application

### C. Force Push to GitHub (Rewrites History)
```bash
# CAUTION: This will rewrite GitHub history
# Make sure your team is aware!

git push origin --force --all
git push origin --force --tags
```

⚠️ **WARNING:** This force push will rewrite history on GitHub. Notify your team:
- @brandon-branch
- @hugo-branch  
- @rene-branch

They will need to re-clone the repository or run:
```bash
git fetch origin
git reset --hard origin/main  # or their branch name
```

## 🔒 Security Best Practices Going Forward

1. ✅ Never commit `.env`, `.env.local`, or `.env.*` files
2. ✅ Always use `.env.local` for local development (already in .gitignore)
3. ✅ Use `env.example` as a template (safe to commit)
4. ✅ Store production secrets in Vercel Environment Variables
5. ✅ Rotate credentials regularly (every 90 days)
6. ✅ Use different credentials for dev/staging/production

## 📞 Questions?
If you need help with any of these steps, ask immediately. Time is critical!

---
**Created:** $(date)  
**Priority:** 🔴 CRITICAL - Complete within 1 hour

