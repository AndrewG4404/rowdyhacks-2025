# MongoDB Atlas Troubleshooting Checklist

## 1. Check Cluster Status
Go to: https://cloud.mongodb.com/
- Click "Database" in left sidebar
- **Is your cluster PAUSED?** 
  - If yes: Click "Resume" button
  - Wait 2-3 minutes for cluster to start

## 2. Verify Network Access
Click "Network Access" in left sidebar
- Do you see an entry with IP: `0.0.0.0/0` ?
- Status should be "ACTIVE" (green)
- If not:
  1. Click "+ ADD IP ADDRESS"
  2. Click "ALLOW ACCESS FROM ANYWHERE"
  3. Click "Confirm"
  4. Wait 1-2 minutes

## 3. Verify Database User
Click "Database Access" in left sidebar
- Find user: `gonzalezandrew528_db_user`
- Status should be "ACTIVE"
- Built-in Role should be "Atlas admin" or "Read and write to any database"
- If user doesn't exist or is locked, recreate it

## 4. Check Connection String
Your current connection string format:
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?options
```

Components:
- Username: gonzalezandrew528_db_user ✓
- Cluster: goloanme.yfgujyf.mongodb.net ✓
- Database: goloanme ✓

## 5. Common Issues

### "Connection reset by peer"
Usually means:
- ❌ IP not whitelisted
- ❌ Cluster is paused
- ❌ Wrong cluster name

### "Authentication failed"
Usually means:
- ❌ Wrong password
- ❌ User doesn't have permissions

### "Server selection timeout"
Usually means:
- ❌ Network access not configured
- ❌ Firewall blocking connection
- ❌ Cluster not running
