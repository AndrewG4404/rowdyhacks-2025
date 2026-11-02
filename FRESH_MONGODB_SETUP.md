# 🆕 Create Fresh MongoDB Cluster (If Current One Has Issues)

## Option: Start Fresh (5 minutes)

1. **Go to:** https://cloud.mongodb.com/
2. **Create New Cluster:**
   - Click "Create" button
   - Choose **FREE M0** tier
   - Provider: AWS
   - Region: Closest to you (e.g., us-east-1)
   - Cluster Name: `goloanme-v2`
   - Click "Create Cluster"

3. **Create Database User:**
   - Click "Database Access" (left sidebar)
   - Click "+ ADD NEW DATABASE USER"
   - Username: `goloanme_user`
   - **Password: AUTO-GENERATE** (copy it!)
   - Built-in Role: **Atlas admin**
   - Click "Add User"

4. **Whitelist All IPs:**
   - Click "Network Access" (left sidebar)
   - Click "+ ADD IP ADDRESS"
   - Click "ALLOW ACCESS FROM ANYWHERE"
   - Click "Confirm"

5. **Get Connection String:**
   - Click "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Click "Drivers"
   - Copy the connection string
   - Replace `<password>` with your generated password
   - Add `/goloanme` before the `?` (database name)

6. **Update .env.local:**
   ```bash
   DATABASE_URL=mongodb+srv://goloanme_user:YOUR_NEW_PASSWORD@cluster0.xxxxx.mongodb.net/goloanme?retryWrites=true&w=majority
   ```

7. **Test:**
   ```bash
   npm run prisma:push
   ```

**This gives you a completely fresh, working cluster in 5 minutes!**
