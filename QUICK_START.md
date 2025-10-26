# GoLoanMe - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
This is **required** to fix the TypeScript import error:
```bash
npx prisma generate
```

### 3. Set Up Environment Variables
Copy the example file and fill in your values:
```bash
cp env.example .env.local
```

**Required values to configure:**
- `AUTH0_DOMAIN` - Your Auth0 tenant domain
- `AUTH0_CLIENT_ID` - Your Auth0 application client ID
- `AUTH0_CLIENT_SECRET` - Your Auth0 application secret
- `AUTH0_AUDIENCE` - Your API identifier
- `DATABASE_URL` - Your MongoDB Atlas connection string
- `OPENROUTER_API_KEY` - Your OpenRouter API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary secret

⚠️ **Security Note:** The old keys in `env.example` were exposed and need to be rotated!

### 4. Push Database Schema
```bash
npm run prisma:push
```

### 5. Seed Demo Data (Optional)
```bash
npm run prisma:seed
```

This creates 3 demo users:
- `carmen_martinez` - Post creator (500 GLM)
- `sam_nguyen` - Donor (1000 GLM)
- `sofia_ramirez` - Verified sponsor (2000 GLM)

### 6. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📱 Available Pages

All pages are complete and ready to test:

- **Landing:** `http://localhost:3000/` - Hero, features, categories
- **Explore:** `http://localhost:3000/explore` - Browse all posts
- **Create Post:** `http://localhost:3000/posts/new` - Create funding request
- **Post Detail:** `http://localhost:3000/posts/[id]` - View post & make pledges
- **Wallet:** `http://localhost:3000/wallet` - View balance & transactions
- **Profile:** `http://localhost:3000/profile/[handle]` - Public user profile
- **Terms:** `http://localhost:3000/terms` - Generate contract templates

---

## 🌐 Language Switching

Toggle between **English** and **Spanish** using the EN/ES buttons in the header.

---

## ⚠️ Current Limitations

1. **Auth0 Not Integrated** - All API calls use placeholder token
2. **Backend APIs Not Running** - Pages will show empty states
3. **Mock Data Only** - Until backend implements the APIs

---

## 🔧 Next Steps for Development

### Frontend Team:
1. Integrate Auth0 (replace `'demo-token'` with real tokens)
2. Test all pages with real backend APIs
3. Add image upload functionality
4. Improve error handling UX

### Backend Team:
1. Implement API endpoints from `GoLoanMe.yaml`
2. Follow `API_INTEGRATION_GUIDE.md`
3. Set up Auth0 JWT validation
4. Deploy to Vercel

---

## 📚 Documentation

- **API Spec:** `GoLoanMe.yaml` - OpenAPI 3.0 spec
- **API Integration:** `API_INTEGRATION_GUIDE.md` - How to connect frontend to backend
- **Frontend Status:** `FRONTEND_STATUS.md` - What's complete
- **Project Rules:** `.cursorrules` - Full project specification

---

## 🐛 Troubleshooting

### "Cannot find module '@prisma/client'"
Run: `npx prisma generate`

### "Port 3000 is already in use"
Kill the process:
```bash
# Windows
netstat -ano | findstr :3000
Stop-Process -Id [PID] -Force

# Mac/Linux
lsof -ti:3000 | xargs kill
```

### "Module not found: Can't resolve 'next-intl'"
Run: `npm install`

### Backend API errors (404, 500, etc.)
- Check that backend APIs are running
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for detailed errors

---

## ✅ Verify Setup

Run this quick verification:
```bash
node verify-setup.js
```

This checks:
- ✅ Node.js version
- ✅ Dependencies installed
- ✅ Environment variables set
- ✅ Prisma client generated

---

**Ready to build! 🎉**

