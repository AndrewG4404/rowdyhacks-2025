# GoLoanMe - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will get your GoLoanMe application running and ready for testing.

---

## Step 1: Generate AUTH0_SECRET (30 seconds)

The `.env.local` file needs a secure `AUTH0_SECRET` value. Generate one:

```bash
openssl rand -hex 32
```

Copy the output, then edit `.env.local` and replace the placeholder:

```bash
# Open .env.local in your editor
nano .env.local

# Find this line:
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'

# Replace with your generated value:
AUTH0_SECRET='a1b2c3d4e5f6...'  # Your 64-character hex string
```

Save and exit.

---

## Step 2: Install Dependencies (1 minute)

```bash
cd /Users/andrewgonzalez/Desktop/BIANgit/rowdyhacks-2025
npm install
```

**Expected output:** `added X packages`

---

## Step 3: Set Up Database (2 minutes)

### Generate Prisma Client:
```bash
npm run prisma:generate
```

**Expected output:** `✔ Generated Prisma Client`

### Push Schema to MongoDB:
```bash
npm run prisma:push
```

**Expected output:** `Your database is now in sync with your Prisma schema.`

### Seed Demo Data:
```bash
npm run prisma:seed
```

**Expected output:**
```
✅ Created 3 demo users:
  - Carmen (carmen) - 1000 GLM
  - Sam (sam) - 500 GLM
  - Sofia (sofia) - 2000 GLM
✅ Created demo post: "Bike for commuting to work"
✅ Created demo pledges
✅ Seed completed!
```

---

## Step 4: Start Development Server (30 seconds)

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in 3.2s
```

**🎉 Server is running!**

---

## Step 5: Test in Browser (1 minute)

### Test Health Endpoint:
Open a new terminal and run:
```bash
curl http://localhost:3000/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2025-10-26T...",
  "uptime": 12.34
}
```

### Test Landing Page:
Open your browser: **http://localhost:3000**

You should see:
- ✅ Hero section with gradient title
- ✅ "Get Started" and "Explore Requests" buttons
- ✅ 3 feature cards (transparent, clear terms, community)
- ✅ "How GoLoanMe Works" section with 4 steps
- ✅ Legal disclaimer banner at top

### Test Explore Page:
Navigate to: **http://localhost:3000/explore**

You should see:
- ✅ Post list with demo data
- ✅ Search bar
- ✅ Category filter dropdown
- ✅ Post card showing "Bike for commuting to work"

---

## Step 6: Test Authentication (2 minutes)

### Log In:
1. Click **"Log In"** button in the header
2. You'll be redirected to Auth0 Universal Login
3. Options:
   - **Option A:** Click "Continue with Google" (recommended)
   - **Option B:** Click "Sign up" and create account with email/password

4. After login, you'll be redirected back to the homepage
5. Your name/avatar should appear in the header

### Verify Protected Routes:
Now that you're logged in, test these pages:

- **Create Post:** http://localhost:3000/posts/new
- **Wallet:** http://localhost:3000/wallet
- **Terms:** http://localhost:3000/terms

All should load successfully without redirecting to login.

---

## Step 7: Run Automated Tests (Optional, 1 minute)

```bash
./test-e2e.sh
```

This will verify:
- ✅ Node.js version
- ✅ Environment variables
- ✅ Server health
- ✅ API endpoints
- ✅ Database connectivity
- ✅ File structure
- ✅ Frontend pages

**Expected output:** `✓ ALL TESTS PASSED!`

---

## 🎯 Quick Demo Flow (3 minutes)

### Create a Post:
1. Navigate to http://localhost:3000/posts/new
2. Fill the form:
   - **Title:** "Help with Tuition Fees"
   - **Description:** "I need help paying for my college tuition this semester"
   - **Category:** Education
   - **Goal:** 1000 GLM
   - **Accept Contracts:** ✓ (check the box)
3. Click **"Create Request"**
4. You'll be redirected to `/explore` - your post should appear!

### Make a Pledge (Use Incognito/Different Browser):
1. Open incognito window: http://localhost:3000
2. Log in with a different account (or Google account)
3. Navigate to `/explore`
4. Click on your "Help with Tuition Fees" post
5. In the pledge form:
   - **Amount:** 200
   - **Note:** "Good luck with school!"
6. Click **"Make Donation"**
7. Success message should appear
8. Progress bar updates to 200/1000 (20%)

### Check Your Wallet:
1. Go back to your first browser (post creator)
2. Navigate to http://localhost:3000/wallet
3. You should see:
   - **Balance:** +200 GLM
   - **Transaction History:** 1 credit entry
   - **Recent Activity:** Shows the pledge

---

## 🧪 Test the LLM Integration (2 minutes)

### Generate Contract Terms:
1. Make sure you're logged in
2. Navigate to http://localhost:3000/terms/new
3. Fill the wizard form:
   - **Title:** "Student Loan Agreement"
   - **Interest Rate:** 5%
   - **Payment Cadence:** Monthly
   - **Grace Period:** 14 days
   - **Collateral:** "None (unsecured loan)"
   - **Remedies:** "Late fees of 2% per month"
   - **Disclaimers:** "Educational use only. Not legally binding."
4. Click **"Generate Contract"**
5. Wait 3-5 seconds (LLM is processing)
6. Contract preview appears with AI-generated HTML
7. Click **"Download PDF"** - PDF should download
8. Contract is saved to your Terms list

---

## 🔍 Verify Everything Works

Run through this checklist:

### Backend API ✅
- [ ] `GET /api/health` returns 200
- [ ] `GET /api/posts` returns posts array
- [ ] `POST /api/posts` creates new post (with auth)
- [ ] `POST /api/posts/{id}/pledges` creates pledge (with auth)
- [ ] `GET /api/wallet` returns balance (with auth)

### Frontend Pages ✅
- [ ] Landing page loads
- [ ] Explore page shows posts
- [ ] Create post form works
- [ ] Post detail shows pledge form
- [ ] Wallet shows balance and transactions
- [ ] Terms wizard generates contract

### Database ✅
- [ ] MongoDB connection works
- [ ] Prisma queries execute
- [ ] Seed data appears in explore page
- [ ] New posts save to database
- [ ] Pledges update ledger entries

### Integrations ✅
- [ ] Auth0 login/logout works
- [ ] OpenRouter generates contracts
- [ ] Cloudinary uploads PDFs
- [ ] Ledger transactions are atomic

---

## 🐛 Common Issues & Fixes

### "Database connection failed"
**Fix:**
```bash
# Check MongoDB connection string
grep DATABASE_URL .env.local

# Verify MongoDB Atlas:
# 1. Go to https://cloud.mongodb.com
# 2. Check cluster is running (not paused)
# 3. Verify network access (whitelist 0.0.0.0/0 or your IP)
# 4. Verify database user credentials
```

### "Auth0 login redirects to error page"
**Fix:**
```bash
# 1. Verify AUTH0_SECRET is set (64-char hex string)
openssl rand -hex 32

# 2. Check AUTH0_BASE_URL matches your actual URL
# For local: http://localhost:3000
# For Vercel: https://your-app.vercel.app

# 3. Update .env.local with correct values
```

### "Terms generation fails"
**Fix:**
```bash
# Check OpenRouter API key
grep OPENROUTER_API_KEY .env.local

# Verify account has credits:
# Go to https://openrouter.ai/settings/keys
# Check usage and add credits if needed
```

### "Port 3000 already in use"
**Fix:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

### "TypeScript errors"
**Fix:**
```bash
npm run type-check
```

### "Linting errors"
**Fix:**
```bash
npm run lint -- --fix
```

---

## 📚 Next Steps

### For Development:
1. ✅ Read `E2E_TEST_PLAN.md` for comprehensive testing
2. ✅ Review `COMPLETE_E2E_STATUS.md` for full feature list
3. ✅ Check `.cursorrules` for project requirements
4. ✅ Explore `src/` directory for code structure

### For Deployment:
1. ✅ Run `npm run build` to test production build
2. ✅ Install Vercel CLI: `npm i -g vercel`
3. ✅ Deploy: `vercel --prod`
4. ✅ Set environment variables in Vercel dashboard
5. ✅ Update Auth0 callback URLs to production domain

### For Demo:
1. ✅ Practice the demo script in `COMPLETE_E2E_STATUS.md`
2. ✅ Create 3 test accounts (Carmen, Sam, Sofia)
3. ✅ Prepare screenshots/screen recording as backup
4. ✅ Test on mobile device for responsive design
5. ✅ Have talking points ready

---

## 🎉 You're Ready!

Your GoLoanMe application is now running with:
- ✅ **20+ API Endpoints** (all working)
- ✅ **8+ Frontend Pages** (responsive & modern)
- ✅ **MongoDB Database** (seeded with demo data)
- ✅ **Auth0 Authentication** (login/logout)
- ✅ **OpenRouter/Gemini** (AI contract generation)
- ✅ **Cloudinary Storage** (PDF uploads)
- ✅ **Immutable Ledger** (GLM transactions)

**Total Setup Time:** ~7 minutes

**Next:** Start testing! 🚀

---

## 📞 Need Help?

- **Testing Guide:** `E2E_TEST_PLAN.md`
- **Full Status:** `COMPLETE_E2E_STATUS.md`
- **Project Rules:** `.cursorrules`
- **API Docs:** `GoLoanMe.yaml` (OpenAPI spec)

**Happy coding! Let's win this hackathon! 🏆**
