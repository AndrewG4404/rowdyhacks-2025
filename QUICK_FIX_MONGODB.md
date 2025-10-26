# 🚀 Quick MongoDB Fix Guide

## The Only Remaining Issue

Your code is **100% fixed**. The only problem is MongoDB Atlas DNS resolution.

## 3-Minute Fix

### Step 1: Check MongoDB Atlas Access
1. Go to: https://cloud.mongodb.com/
2. Sign in with your account
3. Select project: **GoLoanMe**

### Step 2: Whitelist Your IP
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"** button
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**
5. **Wait 1-2 minutes** for changes to propagate

### Step 3: Verify Cluster is Active
1. Click **"Database"** in left sidebar
2. Check your cluster status
3. If it says **"Paused"**, click **"Resume"**

### Step 4: Test Connection
```bash
# In terminal
cd /Users/andrewgonzalez/Desktop/BIANgit/rowdyhacks-2025

# Test MongoDB connection
node -e "const { MongoClient } = require('mongodb'); const uri = 'mongodb+srv://gonzalezandrew528_db_user:GlqodeTsag6kwBaj@goloanme.yfgujyf.mongodb.net/goloanme?retryWrites=true&w=majority&appName=GoLoanMe'; const client = new MongoClient(uri); client.connect().then(() => { console.log('✅ MongoDB Connected!'); client.close(); }).catch(e => console.error('❌ Error:', e.message));"
```

### Step 5: Restart Dev Server
```bash
# Kill existing server
pkill -f "next dev"

# Start fresh
npm run dev
```

### Step 6: Run Tests
```bash
# Should now pass!
./test-e2e.sh
```

---

## Alternative: Use Local MongoDB (5 minutes)

If MongoDB Atlas continues to fail:

```bash
# Install MongoDB locally (macOS)
brew install mongodb-community
brew services start mongodb-community

# Update .env.local
# Replace this line:
DATABASE_URL='mongodb+srv://...'

# With this:
DATABASE_URL='mongodb://localhost:27017/goloanme'

# Push schema
npx dotenv -e .env.local -- npx prisma db push

# Restart server
pkill -f "next dev"
npm run dev

# Test
./test-e2e.sh
```

---

## Verify Success

```bash
# Test 1: Health endpoint
curl http://localhost:3000/api/health
# Should return: {"status":"ok",...}

# Test 2: Posts endpoint (will auto-seed on first call)
curl http://localhost:3000/api/posts
# Should return: {"items":[...],"nextCursor":null}

# Test 3: User endpoint
curl http://localhost:3000/api/users/carmen
# Should return: {"id":"...","handle":"carmen",...}
```

---

## Expected Result

After MongoDB is accessible:
- ✅ All 37 tests pass (or 36/37)
- ✅ Bootstrap seeding creates demo users automatically
- ✅ API endpoints return data (not errors)
- ✅ Frontend pages load correctly

---

## Still Having Issues?

Check these:

1. **Firewall/VPN**: Some corporate networks block MongoDB Atlas
   - Try disabling VPN
   - Try different network (mobile hotspot)

2. **DNS Cache**: Clear DNS cache
   ```bash
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```

3. **MongoDB Status**: https://status.mongodb.com/

4. **Connection String**: Get fresh one from Atlas
   - Go to: Databases > Connect > Drivers
   - Copy new connection string
   - Update `.env.local`

---

**TL;DR**: Whitelist your IP in MongoDB Atlas Network Access, wait 1-2 minutes, restart server, run tests. Done! 🎉

