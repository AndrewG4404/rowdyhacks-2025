# GoLoanMe - End-to-End Testing Plan

## Pre-Test Setup

### 1. Environment Variables
Ensure `.env.local` exists with all required values:
```bash
# Verify environment file exists
ls -la .env.local

# Check critical variables are set (without exposing values)
grep -E "^(AUTH0|DATABASE|OPENROUTER|CLOUDINARY|NEXT_PUBLIC)" .env.local | cut -d= -f1
```

Expected variables:
- ✓ AUTH0_SECRET
- ✓ AUTH0_BASE_URL  
- ✓ AUTH0_ISSUER_BASE_URL
- ✓ AUTH0_CLIENT_ID
- ✓ AUTH0_CLIENT_SECRET
- ✓ AUTH0_AUDIENCE
- ✓ NEXT_PUBLIC_BASE_URL
- ✓ DATABASE_URL
- ✓ OPENROUTER_API_KEY
- ✓ CLOUDINARY_CLOUD_NAME
- ✓ CLOUDINARY_API_KEY
- ✓ CLOUDINARY_API_SECRET

### 2. Database Setup
```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to MongoDB
npm run prisma:push

# Seed with demo data
npm run prisma:seed
```

Expected output:
- ✓ Prisma Client generated
- ✓ Database schema synchronized
- ✓ 3 demo users created (Carmen, Sam, Sofia)
- ✓ Demo posts and pledges created
- ✓ GLM accounts initialized

### 3. Dependencies
```bash
# Install all dependencies
npm install

# Verify critical packages
npm list @auth0/nextjs-auth0 @prisma/client next cloudinary zod
```

---

## Test Phase 1: Server & Infrastructure

### Test 1.1: Start Development Server
```bash
npm run dev
```

**Expected Output:**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in Xs
```

**Verification:**
- [ ] Server starts without errors
- [ ] No TypeScript compilation errors
- [ ] No linting errors
- [ ] Port 3000 is listening

### Test 1.2: Health Check Endpoint
```bash
curl http://localhost:3000/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2025-10-26T...",
  "uptime": 123.45
}
```

**Verification:**
- [ ] Returns 200 OK
- [ ] JSON response is valid
- [ ] Timestamp is current
- [ ] Uptime is a positive number

---

## Test Phase 2: Authentication (Auth0)

### Test 2.1: Login Flow
**Manual Test:**
1. Open browser: http://localhost:3000
2. Click "Log In" button
3. Redirects to Auth0 Universal Login
4. Log in with demo credentials OR create new account
5. Redirects back to http://localhost:3000

**Verification:**
- [ ] Auth0 login page loads
- [ ] Google Social login option visible
- [ ] Email/password login works
- [ ] Redirects back successfully
- [ ] User name/avatar appears in header
- [ ] Protected routes are now accessible

### Test 2.2: Session Persistence
**Manual Test:**
1. Log in (from Test 2.1)
2. Refresh the page
3. Navigate to /wallet
4. Refresh again

**Verification:**
- [ ] User stays logged in after refresh
- [ ] Session persists across page navigation
- [ ] Token is valid for API calls

### Test 2.3: Logout Flow
**Manual Test:**
1. Log in (from Test 2.1)
2. Click "Log Out" button
3. Redirects to logout confirmation

**Verification:**
- [ ] Logout completes successfully
- [ ] User is redirected to homepage
- [ ] Protected routes redirect to login
- [ ] Session is cleared

---

## Test Phase 3: API Endpoints

### Test 3.1: Public Endpoints (No Auth Required)

#### GET /api/health
```bash
curl http://localhost:3000/api/health
```
**Expected:** 200 OK with status object

#### GET /api/users/{handle}
```bash
curl http://localhost:3000/api/users/carmen
```
**Expected:** 200 OK with user profile

#### GET /api/posts
```bash
curl http://localhost:3000/api/posts
```
**Expected:** 200 OK with posts array

#### GET /api/posts/{id}
```bash
curl http://localhost:3000/api/posts/[POST_ID_FROM_SEED]
```
**Expected:** 200 OK with post details

### Test 3.2: Protected Endpoints (Auth Required)

**Setup:** Get auth token
```bash
# Log in via browser, then extract token from browser DevTools:
# 1. Open DevTools → Application → Cookies
# 2. Find appSession cookie
# 3. Use for Authorization header
```

#### GET /api/me
```bash
curl http://localhost:3000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** 200 OK with current user data

#### POST /api/posts
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "description": "This is a test post created via API",
    "category": "education",
    "goal": 500,
    "acceptContracts": true
  }'
```
**Expected:** 201 Created with new post object

#### POST /api/posts/{id}/pledges
```bash
curl -X POST http://localhost:3000/api/posts/[POST_ID]/pledges \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "DONATION",
    "amountGLM": 100,
    "note": "Good luck with your project!"
  }'
```
**Expected:** 201 Created with pledge object

#### GET /api/wallet
```bash
curl http://localhost:3000/api/wallet \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** 200 OK with wallet balance and stats

#### GET /api/terms/me
```bash
curl http://localhost:3000/api/terms/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** 200 OK with user's terms templates

---

## Test Phase 4: UI Pages

### Test 4.1: Landing Page (/)
**Manual Test:** http://localhost:3000

**Verification:**
- [ ] Hero section displays
- [ ] "Get Started" and "Explore Requests" CTAs visible
- [ ] Features section shows 3 benefits
- [ ] "How GoLoanMe Works" section with 4 steps
- [ ] Call-to-action section at bottom
- [ ] Legal disclaimer banner visible
- [ ] Responsive on mobile (375px) and desktop (1920px)

### Test 4.2: Explore Page (/explore)
**Manual Test:** http://localhost:3000/explore

**Verification:**
- [ ] Posts list displays
- [ ] Search bar works
- [ ] Category filter works
- [ ] Post cards show title, description, category, owner
- [ ] Progress bars display correctly
- [ ] Pagination/Load More works
- [ ] Clicking post navigates to detail page

### Test 4.3: Create Post Page (/posts/new)
**Manual Test:** http://localhost:3000/posts/new (must be logged in)

**Verification:**
- [ ] Form displays with all fields
- [ ] Title, description, category, goal are required
- [ ] "Accept Contracts" checkbox works
- [ ] Form validation shows errors
- [ ] Submit creates post successfully
- [ ] Redirects to explore page after creation
- [ ] Legal notice banner displays

### Test 4.4: Post Detail Page (/posts/[id])
**Manual Test:** http://localhost:3000/posts/[POST_ID]

**Verification:**
- [ ] Post details display correctly
- [ ] Owner info shows with avatar/handle
- [ ] Progress bar updates based on pledges
- [ ] Pledge form displays (logged in users)
- [ ] Donation tab works
- [ ] Contract pledge tab works (if acceptContracts=true)
- [ ] Terms dropdown populates (for contract pledges)
- [ ] Submitting pledge updates post stats
- [ ] Comments section displays (if implemented)

### Test 4.5: Wallet Page (/wallet)
**Manual Test:** http://localhost:3000/wallet (must be logged in)

**Verification:**
- [ ] Current balance displays
- [ ] Total received/sent/transaction count shows
- [ ] Transaction history lists entries
- [ ] "Transfer" button opens modal
- [ ] "Add Credits" button opens modal (demo only)
- [ ] Transfer form validates and submits
- [ ] Transaction list shows correct credit/debit indicators
- [ ] "Overview" and "Transaction History" tabs work

### Test 4.6: Terms Page (/terms)
**Manual Test:** http://localhost:3000/terms (must be logged in)

**Verification:**
- [ ] "Create New Terms" button visible
- [ ] Existing terms templates list displays
- [ ] Clicking template shows details
- [ ] PDF download link works

### Test 4.7: Terms Wizard (/terms/new)
**Manual Test:** http://localhost:3000/terms/new (must be logged in)

**Verification:**
- [ ] Multi-step form displays
- [ ] All input fields work (title, interest, cadence, grace period, etc.)
- [ ] Form validation works
- [ ] Submit sends data to backend
- [ ] LLM generates contract HTML
- [ ] PDF generates and uploads to Cloudinary
- [ ] Terms template saves to database
- [ ] Preview displays generated contract

---

## Test Phase 5: End-to-End User Flows

### Flow 5.1: Complete Fundraiser Journey
**Steps:**
1. User A logs in
2. Creates new post: "Help with Medical Bills"
   - Category: Medical
   - Goal: 500 GLM
   - Description: "Need surgery funds"
   - Accept Contracts: YES
3. User B logs in (different browser/incognito)
4. Browses /explore, finds User A's post
5. Makes donation of 200 GLM
6. User C logs in
7. Creates terms template (3% interest, monthly, 7-day grace)
8. Finds User A's post
9. Makes contract pledge of 300 GLM with terms
10. User A views post detail
    - Progress bar: 500/500 (100%)
    - 2 pledges visible
11. User A views wallet
    - Balance increased by 500 GLM
    - 2 ledger entries (credits)
12. User B views wallet
    - Balance decreased by 200 GLM
    - 1 ledger entry (debit)
13. User C views wallet
    - Balance decreased by 300 GLM
    - 1 ledger entry (debit)

**Verification:**
- [ ] All steps complete without errors
- [ ] Ledger balances are correct for all users
- [ ] Post accounts reflect correct totals
- [ ] Transaction atomicity preserved
- [ ] No double-charging or lost funds

### Flow 5.2: Contract Terms Generation
**Steps:**
1. User logs in
2. Navigates to /terms/new
3. Fills form:
   - Title: "Personal Loan Agreement"
   - Interest: 5%
   - Cadence: monthly
   - Grace Period: 14 days
   - Collateral: "Vehicle title"
   - Remedies: "Late fees apply"
   - Disclaimers: "Educational use only"
4. Submits form
5. Backend calls OpenRouter → Gemini
6. LLM generates structured contract HTML
7. Server generates PDF from HTML
8. Uploads PDF to Cloudinary
9. Saves TermsTemplate to database
10. Redirects to /terms with success message

**Verification:**
- [ ] OpenRouter API called successfully
- [ ] Gemini responds with valid HTML
- [ ] PDF generated correctly
- [ ] Cloudinary upload succeeds
- [ ] Database record created
- [ ] PDF downloadable from terms list

---

## Test Phase 6: Integration Testing

### Test 6.1: MongoDB Connection
```bash
# Via Prisma Studio
npm run prisma:studio
```

**Verification:**
- [ ] Prisma Studio opens at http://localhost:5555
- [ ] All models visible (User, Post, Pledge, Account, LedgerEntry, etc.)
- [ ] Seeded data appears correctly
- [ ] Can query and view relationships

### Test 6.2: OpenRouter / Gemini Integration
**Manual Test:**
1. Create terms template via UI
2. Check backend logs for OpenRouter API call
3. Verify response contains HTML and schema

**Expected Logs:**
```
Calling OpenRouter with model: google/gemini-2.5-flash
OpenRouter response received
Contract HTML generated: 1234 characters
```

**Verification:**
- [ ] API call succeeds
- [ ] Gemini returns structured response
- [ ] HTML is valid and well-formatted
- [ ] Fallback model triggers on 429 (rate limit)

### Test 6.3: Cloudinary Storage
**Manual Test:**
1. Create terms template (generates PDF)
2. Check Cloudinary dashboard: https://console.cloudinary.com
3. Verify PDF uploaded to `terms-pdf` folder

**Verification:**
- [ ] PDF appears in Cloudinary Media Library
- [ ] Public URL is accessible
- [ ] File size is reasonable (< 1MB for demo)
- [ ] Metadata includes correct public_id

### Test 6.4: Auth0 Integration
**Manual Test:**
1. Log in via Auth0
2. Check Auth0 dashboard: https://manage.auth0.com
3. Verify user appears in Users list
4. Check Auth0 logs for login event

**Verification:**
- [ ] User created in Auth0 on first login
- [ ] JWT token issued correctly
- [ ] Audience and issuer match config
- [ ] Token validation works in API routes

---

## Test Phase 7: Error Handling & Edge Cases

### Test 7.1: Invalid API Requests
```bash
# Missing required fields
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```
**Expected:** 400 Bad Request with validation errors

```bash
# Invalid token
curl http://localhost:3000/api/me \
  -H "Authorization: Bearer invalid_token"
```
**Expected:** 401 Unauthorized

```bash
# Resource not found
curl http://localhost:3000/api/posts/nonexistent_id
```
**Expected:** 404 Not Found

### Test 7.2: Insufficient GLM Balance
**Manual Test:**
1. User with 100 GLM balance
2. Attempt to pledge 200 GLM to a post
3. Submit pledge

**Expected:**
- Error message: "Insufficient balance"
- Pledge not created
- No ledger entries created

### Test 7.3: LLM Rate Limiting
**Manual Test:**
1. Create 10 terms templates rapidly
2. Trigger OpenRouter rate limit

**Expected:**
- Fallback to secondary model
- User-friendly error message if both fail
- Option to retry
- Last successful template cached

### Test 7.4: MongoDB Connection Loss
**Manual Test:**
1. Stop MongoDB (pause Atlas cluster)
2. Attempt to fetch /api/posts

**Expected:**
- 500 Internal Server Error
- Graceful error message
- No app crash
- Logs show connection error

---

## Test Phase 8: Performance & Load

### Test 8.1: Page Load Times
**Metrics:**
- Landing page: < 3 seconds (First Contentful Paint)
- Explore page: < 2 seconds
- Wallet page: < 2 seconds

**Tool:** Chrome DevTools → Lighthouse

### Test 8.2: API Response Times
```bash
# Measure response time
time curl http://localhost:3000/api/posts
```

**Expected:**
- Health check: < 100ms
- List posts: < 500ms
- Create post: < 1s
- Generate terms: < 5s (LLM call)

### Test 8.3: Concurrent Users
**Simulation:**
- Use Apache Bench or Artillery
- 10 concurrent users browsing /explore

```bash
ab -n 100 -c 10 http://localhost:3000/explore
```

**Expected:**
- No errors
- Average response time < 1s
- No memory leaks

---

## Test Phase 9: Security

### Test 9.1: Authentication Bypass Attempts
```bash
# Attempt to access protected route without token
curl http://localhost:3000/api/me
```
**Expected:** 401 Unauthorized

```bash
# Attempt to modify another user's data
curl -X PATCH http://localhost:3000/api/posts/[OTHER_USER_POST_ID] \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CLOSED"}'
```
**Expected:** 403 Forbidden

### Test 9.2: XSS Prevention
**Manual Test:**
1. Create post with title: `<script>alert('XSS')</script>`
2. View post detail page

**Expected:**
- Script tag is escaped/sanitized
- No alert popup
- Title displays as plain text

### Test 9.3: SQL Injection (N/A for MongoDB)
**Note:** MongoDB + Prisma ORM prevents SQL injection

### Test 9.4: Rate Limiting
**Manual Test:**
1. Make 200 rapid requests to /api/health
2. Check for rate limit response

**Expected:**
- 429 Too Many Requests after threshold
- Retry-After header present

---

## Test Phase 10: Internationalization (i18n)

### Test 10.1: Language Switching
**Manual Test:**
1. Open http://localhost:3000
2. Click language toggle (EN/ES)
3. Verify UI updates to Spanish

**Verification:**
- [ ] Navigation labels translate
- [ ] Button text translates
- [ ] Category labels translate
- [ ] Form labels translate
- [ ] Legal disclaimers translate
- [ ] User-generated content NOT translated (correct)

### Test 10.2: Locale Persistence
**Manual Test:**
1. Switch to Spanish
2. Refresh page
3. Navigate to /explore

**Verification:**
- [ ] Locale stays Spanish after refresh
- [ ] Locale persists across navigation
- [ ] Cookie/localStorage stores preference

---

## Test Summary Checklist

### Infrastructure ✓
- [ ] Node.js >=18.0.0
- [ ] npm install successful
- [ ] Dev server starts
- [ ] No TypeScript errors
- [ ] No linting errors

### Database ✓
- [ ] MongoDB Atlas connection
- [ ] Prisma schema synced
- [ ] Seed data loaded
- [ ] Prisma Studio accessible

### Authentication ✓
- [ ] Auth0 login works
- [ ] Session persists
- [ ] Logout works
- [ ] Token validation works

### API Endpoints ✓
- [ ] All 20+ endpoints implemented
- [ ] Public routes accessible
- [ ] Protected routes require auth
- [ ] Error handling correct

### UI Pages ✓
- [ ] Landing page loads
- [ ] Explore page works
- [ ] Create post works
- [ ] Post detail works
- [ ] Wallet works
- [ ] Terms wizard works
- [ ] Admin panel accessible

### Integrations ✓
- [ ] OpenRouter/Gemini works
- [ ] Cloudinary uploads work
- [ ] PDF generation works
- [ ] Ledger transactions atomic

### User Flows ✓
- [ ] Complete fundraiser journey
- [ ] Contract terms generation
- [ ] Pledge → wallet update flow

### Error Handling ✓
- [ ] Invalid requests handled
- [ ] Insufficient balance caught
- [ ] LLM failures graceful
- [ ] Network errors handled

---

## Next Steps for Production

1. **Environment Variables:**
   - Rotate all secrets before deploying
   - Use Vercel Environment Variables (not .env.local)

2. **Database:**
   - Upgrade MongoDB Atlas to M10 (production tier)
   - Enable backups
   - Set up monitoring

3. **Auth0:**
   - Configure production callback URLs
   - Enable MFA (optional)
   - Set up custom branding

4. **Deployment:**
   - Deploy to Vercel: `vercel --prod`
   - Verify environment variables
   - Run health check on production URL

5. **Monitoring:**
   - Set up Sentry for error tracking
   - Monitor Vercel logs
   - Set up alerts for critical errors

---

## Demo Script (2-3 Minutes)

**Setup:** 3 test accounts (Carmen, Sam, Sofia)

**Flow:**
1. [Sofia] Log in → Create Terms → Preview → Download PDF
2. [Carmen] Log in → Create Post → Medical category → Accept contracts
3. [Sam] Log in → View Carmen's post → Donate 100 GLM
4. [Sofia] View Carmen's post → Contract pledge 400 GLM
5. [Carmen] View post → Show progress (500/500) → View wallet
6. Switch to Spanish → UI updates
7. [Admin] Admin panel → Verify Sofia as sponsor

**Talking Points:**
- Simulated currency for underserved communities
- AI-generated contract templates
- Two pledge types: donation vs contract
- Immutable ledger for transparency
- Bilingual (EN/ES) support

---

**✅ End-to-End Testing Complete!**

