# ▶️ Execute Tests NOW - Simple 5-Step Guide

**Current Status:** 🟢 Code 100% Complete | ⏳ Ready for Manual Testing

---

## 🚀 Quick Start (5 Minutes)

### **Step 1: Generate AUTH0_SECRET** (30 seconds)
```bash
cd /Users/andrewgonzalez/Desktop/BIANgit/rowdyhacks-2025
openssl rand -hex 32
```

**Copy the output**, then:
```bash
nano .env.local
# OR
code .env.local
# OR
open -e .env.local
```

Find the line `AUTH0_SECRET='your-secret-here-generate-with-openssl-rand-hex-32'` and replace with your generated value.

**Example:**
```bash
# BEFORE:
AUTH0_SECRET='your-secret-here-generate-with-openssl-rand-hex-32'

# AFTER:
AUTH0_SECRET='a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456'
```

Save and close the file.

---

### **Step 2: Install & Setup** (2 minutes)
```bash
cd /Users/andrewgonzalez/Desktop/BIANgit/rowdyhacks-2025

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Push schema to MongoDB
npm run prisma:push

# Seed demo data
npm run prisma:seed
```

**Expected Output:**
```
✓ Prisma Client generated
✓ Database schema synchronized
✓ Seed data created (3 users, 1 post)
```

---

### **Step 3: Start Development Server** (30 seconds)
```bash
npm run dev
```

**Expected Output:**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in 3.2s
```

**Keep this terminal window open!** The server must run continuously.

---

### **Step 4: Open New Terminal & Run Tests** (1 minute)

Open a **NEW terminal window** (keep dev server running in first window), then:

```bash
cd /Users/andrewgonzalez/Desktop/BIANgit/rowdyhacks-2025

# Make test script executable
chmod +x test-e2e.sh

# Run automated tests
./test-e2e.sh
```

**Expected Output:**
```
✅ Environment variables configured
✅ Server responding at http://localhost:3000
✅ Health check passed
✅ API endpoints accessible
✅ Database connected
```

---

### **Step 5: Test in Browser** (1 minute)

Open your browser:
```
http://localhost:3000
```

**Quick Checks:**
1. ✅ Landing page loads with animations
2. ✅ Click "Log In" → Auth0 login appears
3. ✅ Navigate to `/explore` → Posts display
4. ✅ Click "Explore Requests" → Posts list loads

---

## 🧪 Complete Testing (30 Minutes)

Once the quick start works, follow the detailed testing plan:

### **Phase 1: Authentication (5 min)**
1. Click "Log In" button
2. Sign in with email/password OR Google
3. Verify avatar/name appears in header
4. Try logging out
5. Log back in

### **Phase 2: Browse & Explore (5 min)**
1. Go to http://localhost:3000/explore
2. Use search bar: type "bike"
3. Use category filter: select "Education"
4. Click on a post card to view details

### **Phase 3: Create Content (10 min)**
1. **Create Post:**
   - Go to http://localhost:3000/posts/new
   - Fill all fields
   - Submit
   - Verify it appears in /explore

2. **Generate Terms:**
   - Go to http://localhost:3000/terms/new
   - Fill contract form
   - Submit
   - Wait for AI generation (5-30 seconds)
   - Download PDF

### **Phase 4: Pledges & Wallet (5 min)**
1. **Make Donation:**
   - Find a post
   - Click "Donate"
   - Enter amount: 100
   - Submit

2. **Check Wallet:**
   - Go to http://localhost:3000/wallet
   - Verify balance decreased by 100
   - Check transaction history

### **Phase 5: Admin Functions (5 min)**
1. Go to http://localhost:3000/admin
2. Find a user
3. Toggle "Verified" status
4. Go to that user's profile
5. Verify badge appears

---

## 🎯 Demo Script Test (5 Minutes)

Test the full demo flow:

### **Setup: 3 Browser Windows**
- **Window A:** Carmen (or create account "Carmen")
- **Window B:** Sam (or create account "Sam")
- **Window C:** Sofia (or create account "Sofia")

### **Demo Flow:**
1. **[Sofia]** Create contract terms (3% interest, monthly, 7-day grace)
2. **[Carmen]** Create post "Help with Medical Bills" (500 GLM goal, accept contracts)
3. **[Sam]** Donate 100 GLM to Carmen's post
4. **[Sofia]** Contract pledge 400 GLM with her terms
5. **[Carmen]** View post → Progress = 500/500 (100%)
6. **[Carmen]** View wallet → Balance = +500 GLM
7. **[Admin]** Verify Sofia as sponsor

---

## ✅ Success Criteria

Your tests **PASS** if:
- ✅ Server starts without errors
- ✅ Health check returns 200 OK
- ✅ Can log in with Auth0
- ✅ Can browse posts
- ✅ Can create post
- ✅ AI generates contract terms
- ✅ Can make pledge
- ✅ Wallet balance updates correctly
- ✅ Ledger shows all transactions
- ✅ Admin can verify sponsors

---

## ❌ If Something Fails

### **Server Won't Start:**
```bash
# Check if port 3000 is in use
lsof -i :3000

# If yes, kill it
kill -9 <PID>

# Try again
npm run dev
```

### **MongoDB Connection Error:**
```bash
# Check DATABASE_URL in .env.local
grep DATABASE_URL .env.local

# Verify MongoDB Atlas:
# 1. Go to https://cloud.mongodb.com
# 2. Check cluster is running (not paused)
# 3. Check Network Access → Allow 0.0.0.0/0
# 4. Check Database Access → User exists and has permissions
```

### **Auth0 Login Fails:**
1. Check Auth0 dashboard: https://manage.auth0.com
2. Verify Callback URLs include: `http://localhost:3000/api/auth/callback`
3. Verify AUTH0_SECRET is set in .env.local (must be 64-character hex)
4. Clear browser cookies and try again

### **LLM/OpenRouter Fails:**
```bash
# Check API key
grep OPENROUTER_API_KEY .env.local

# Verify key is valid at https://openrouter.ai/keys
```

### **Cloudinary Upload Fails:**
```bash
# Check credentials
grep CLOUDINARY .env.local

# Verify at https://console.cloudinary.com
```

---

## 📊 Test Results

After running all tests, fill out:

### **Infrastructure:**
- [ ] Server starts: ___________
- [ ] Health check: ___________
- [ ] MongoDB connected: ___________

### **Authentication:**
- [ ] Can log in: ___________
- [ ] Session persists: ___________
- [ ] Can log out: ___________

### **Core Features:**
- [ ] Browse posts: ___________
- [ ] Create post: ___________
- [ ] Make pledge: ___________
- [ ] Generate terms: ___________
- [ ] View wallet: ___________

### **Integrations:**
- [ ] Auth0 working: ___________
- [ ] MongoDB working: ___________
- [ ] OpenRouter/Gemini working: ___________
- [ ] Cloudinary working: ___________

### **Demo Script:**
- [ ] All 7 steps complete: ___________
- [ ] No errors: ___________

---

## 🎉 When All Tests Pass

**You're ready to:**
1. ✅ Deploy to production (Vercel)
2. ✅ Practice demo presentation
3. ✅ WIN THE HACKATHON! 🏆

---

## 📝 Report Your Results

After testing, document your findings:
```bash
# Create test results file
echo "# Test Execution Results - $(date)" > TEST_RESULTS.md
echo "" >> TEST_RESULTS.md
echo "## Quick Start" >> TEST_RESULTS.md
echo "- [ ] AUTH0_SECRET generated" >> TEST_RESULTS.md
echo "- [ ] Dependencies installed" >> TEST_RESULTS.md
echo "- [ ] Prisma setup complete" >> TEST_RESULTS.md
echo "- [ ] Server started" >> TEST_RESULTS.md
echo "- [ ] Tests executed" >> TEST_RESULTS.md
echo "- [ ] Browser tests complete" >> TEST_RESULTS.md
echo "" >> TEST_RESULTS.md
echo "## Issues Found" >> TEST_RESULTS.md
echo "<!-- List any issues here -->" >> TEST_RESULTS.md
```

---

## 🚀 START NOW!

**Run these 3 commands to begin:**
```bash
cd /Users/andrewgonzalez/Desktop/BIANgit/rowdyhacks-2025
openssl rand -hex 32
npm install && npm run prisma:generate && npm run prisma:push && npm run prisma:seed && npm run dev
```

**Then open:** http://localhost:3000

---

**Time to complete:** 5 minutes for quick start, 30 minutes for full testing  
**Difficulty:** Easy (follow the commands)  
**Status:** Ready to execute NOW! ✅


