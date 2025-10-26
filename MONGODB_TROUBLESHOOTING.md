# 🔧 MongoDB Atlas Connection Issues

## Your Error: "Connection reset by peer (os error 54)"

This typically means one of these issues:

### 1️⃣ **Most Likely: Cluster is PAUSED** (Free M0 clusters auto-pause)

**Fix:**
1. Go to: https://cloud.mongodb.com/
2. Click **"Database"** (left sidebar)
3. Look for your cluster status
4. If it says **"PAUSED"** → Click **"Resume"**
5. Wait 2-3 minutes for cluster to fully start
6. Try connection again

### 2️⃣ **Network Access Not Set Up**

**Fix:**
1. Go to: https://cloud.mongodb.com/
2. Click **"Network Access"** (left sidebar, under Security)
3. Check if you see: `0.0.0.0/0` with Status: **ACTIVE**
4. If not:
   - Click **"+ ADD IP ADDRESS"**
   - Click **"ALLOW ACCESS FROM ANYWHERE"**
   - Click **"Confirm"**
   - **Wait 2-3 minutes** for propagation

### 3️⃣ **Wrong Cluster Name**

Your connection string points to: `goloanme.yfgujyf.mongodb.net`

**Verify:**
1. Go to Database → Click "Connect" on your cluster
2. Copy the connection string
3. Compare with your `.env.local` DATABASE_URL

### 4️⃣ **Firewall/VPN Blocking**

**Try:**
```bash
# Test if you can reach MongoDB at all
nc -zv ac-q3ifuk3-shard-00-00.yfgujyf.mongodb.net 27017
```

If connection refused → Your network/firewall is blocking port 27017

---

## 🚀 **Workaround: Run Without Database (For Now)**

You can start development without MongoDB working:

1. **Comment out database calls temporarily**
2. **Use mock data in API routes**
3. **Fix MongoDB in parallel**

The dev server works fine without DB for frontend development!

---

## 📞 **Quick Test Command**

After making ANY changes in Atlas, wait 2-3 minutes then run:

```bash
npm run prisma:push
```

**Success looks like:**
```
✓ The database is already in sync with the Prisma schema
```

**Still failing?** The issue is in Atlas, not your code!
