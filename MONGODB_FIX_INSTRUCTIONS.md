# MongoDB Connection Fix Instructions

## Current Issue

The MongoDB Atlas connection is failing with DNS resolution error:
```
querySrv ENOTFOUND _mongodb._tcp.goloanme.yfgujyf.mongodb.net
```

## Immediate Solutions

### Option 1: Fix MongoDB Atlas Network Access

1. **Go to MongoDB Atlas Dashboard**: https://cloud.mongodb.com/
2. **Select your project**: GoLoanMe
3. **Navigate to**: Network Access (left sidebar)
4. **Click**: "Add IP Address"
5. **Choose one**:
   - **For development**: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - **For security**: Add your current IP address
6. **Click**: "Confirm"
7. **Wait**: 1-2 minutes for changes to propagate

### Option 2: Verify Cluster Status

1. **Go to**: Database Deployments
2. **Check**: Your cluster status (should be "Active", not "Paused")
3. **If paused**: Click "Resume" button

### Option 3: Update Connection String

Your current connection string:
```
mongodb+srv://gonzalezandrew528_db_user:GlqodeTsag6kwBaj@goloanme.yfgujyf.mongodb.net/goloanme?retryWrites=true&w=majority&appName=GoLoanMe
```

Try alternative format in `.env.local`:
```bash
# Option A: Add explicit DNS resolution
DATABASE_URL='mongodb+srv://gonzalezandrew528_db_user:GlqodeTsag6kwBaj@goloanme.yfgujyf.mongodb.net/goloanme?retryWrites=true&w=majority&appName=GoLoanMe&directConnection=false'

# Option B: Use standard connection (get from Atlas Connect button)
# Go to Atlas > Databases > Connect > Drivers > Copy connection string
```

### Option 4: Test Connection Directly

```bash
# Test with mongosh
mongosh "mongodb+srv://goloanme.yfgujyf.mongodb.net/goloanme" --username gonzalezandrew528_db_user

# Or test with Node.js
node -e "const { MongoClient } = require('mongodb'); const client = new MongoClient('YOUR_CONNECTION_STRING'); client.connect().then(() => console.log('Connected!')).catch(e => console.error(e));"
```

### Option 5: Check DNS Resolution

```bash
# Test DNS lookup
nslookup goloanme.yfgujyf.mongodb.net

# If DNS fails, try different DNS servers
# On macOS:
sudo networksetup -setdnsservers Wi-Fi 8.8.8.8 8.8.4.4
sudo dscacheutil -flushcache

# On Linux:
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
```

## After Fixing MongoDB

1. **Restart dev server**:
   ```bash
   # Kill existing server
   pkill -f "next dev"
   
   # Start fresh
   npm run dev
   ```

2. **Test connection**:
   ```bash
   curl http://localhost:3000/api/posts
   # Should return: {"items":[],"nextCursor":null} or seeded data
   ```

3. **Run E2E tests**:
   ```bash
   ./test-e2e.sh
   ```

## Temporary Workaround (If MongoDB Still Fails)

If MongoDB continues to fail, you can use a local MongoDB instance for development:

### Install MongoDB Locally

```bash
# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongod
```

### Update .env.local

```bash
# Replace MongoDB Atlas URL with local
DATABASE_URL='mongodb://localhost:27017/goloanme'
```

### Push Schema

```bash
npx dotenv -e .env.local -- npx prisma db push
```

### Seed Data

```bash
npx dotenv -e .env.local -- npx prisma db seed
```

## Verification Checklist

- [ ] MongoDB Atlas cluster is Active (not Paused)
- [ ] Network Access allows your IP or 0.0.0.0/0
- [ ] DNS resolution works: `nslookup goloanme.yfgujyf.mongodb.net`
- [ ] Connection string is correct in `.env.local`
- [ ] Dev server restarted after `.env.local` changes
- [ ] `/api/health` endpoint returns 200
- [ ] `/api/posts` endpoint returns data (not error)
- [ ] `/api/users/carmen` endpoint returns 200

## Expected Behavior After Fix

When MongoDB is working correctly:

1. **First API request triggers bootstrap seed**:
   - Creates users: carmen, sam, sofia
   - Creates accounts with 1000 GLM each
   - Creates demo posts

2. **Subsequent requests use existing data**

3. **All E2E tests pass**

## Need Help?

If MongoDB continues to fail:

1. **Check MongoDB Atlas Status**: https://status.mongodb.com/
2. **Verify account**: https://cloud.mongodb.com/
3. **Review connection string format**: https://www.mongodb.com/docs/manual/reference/connection-string/
4. **Consider local MongoDB** for immediate development

