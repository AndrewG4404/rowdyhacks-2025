# 🚀 GoLoanMe - Community Micro-Funding Platform

**24-hour hackathon project** - Simulated GLM credit system for underserved communities

**⚠️ IMPORTANT: This is a simulated ledger with fake currency (GLM credits). NO real money rails.**

---

## 📋 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** 
- **MongoDB Atlas** account (free M0 tier)
- **Cloudinary** account (free tier)
- **OpenRouter** API key (free tier)
- **Auth0** account (free tier)

### 1. Clone & Install

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate
```

### 2. Environment Setup

Copy `env.example` to `.env.local`:

```bash
cp env.example .env.local
```

Fill in your credentials in `.env.local`:

#### Auth0 Setup (https://auth0.com)
1. Create tenant
2. Create Application (Regular Web App)
3. Enable Database + Google connections
4. Set callback URLs:
   - `https://www.fundmebabyonemoretime.us/api/auth/callback`
   - `http://localhost:3000/api/auth/callback`
5. Copy credentials to `.env.local`

#### OpenRouter (https://openrouter.ai/keys)
- Get API key
- Add to `.env.local`

#### MongoDB Atlas (https://cloud.mongodb.com)
- Create cluster (M0 free tier)
- Get connection string
- Add to `.env.local`

#### Cloudinary (https://console.cloudinary.com)
- Get cloud name, API key, API secret
- Add to `.env.local`

### 3. Database Setup

```bash
# Push schema to MongoDB
npm run prisma:migrate

# Seed demo data (carmen, sam, sofia users)
npm run prisma:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit:
- **Frontend:** http://localhost:3000
- **API Health:** http://localhost:3000/api/health
- **Prisma Studio:** `npm run prisma:studio`

---

## 🏗️ Project Structure

```
rowdyhacks-2025/
├── prisma/
│   ├── schema.prisma          # MongoDB schema (all models)
│   └── seed.ts                # Demo data
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API routes (BACKEND)
│   │   │   ├── health/
│   │   │   ├── me/
│   │   │   ├── users/
│   │   │   ├── posts/
│   │   │   ├── terms/
│   │   │   └── wallet/
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components (FRONTEND EMPTY)
│   ├── lib/                   # Backend utilities
│   │   ├── auth.ts            # Auth0 JWT validation
│   │   ├── db.ts              # Prisma client
│   │   ├── llm.ts             # OpenRouter/Gemini
│   │   ├── pdf.ts             # PDF generation
│   │   ├── storage.ts         # Cloudinary
│   │   ├── ledger.ts          # GLM credit logic
│   │   └── validations.ts     # Zod schemas
│   ├── i18n/                  # Internationalization
│   │   ├── config.ts
│   │   └── messages/
│   │       ├── en.json
│   │       └── es.json
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── styles/
│       └── globals.css
├── .cursorrules               # Project PRD & rules
├── GoLoanMe.yaml              # OpenAPI spec
├── env.example                # Environment template
└── package.json
```

---

## 🔑 API Endpoints

### Public (No Auth)
- `GET /api/health` - Health check
- `GET /api/users/{handle}` - User profile
- `GET /api/posts` - List posts
- `GET /api/posts/{id}` - Post detail

### Protected (Requires JWT)
- `GET /api/me` - Current user
- `PATCH /api/me` - Update profile
- `POST /api/posts` - Create post
- `POST /api/terms` - Generate contract (LLM)
- `GET /api/wallet` - Wallet balance
- `POST /api/posts/{id}/pledges` - Donate/pledge

**Full API spec:** See `GoLoanMe.yaml`

---

## 🧪 Testing

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Unit tests (TODO)
npm test

# E2E tests (TODO)
npm run test:e2e
```

---

## 🌐 i18n (Internationalization)

Supported locales: **English (en)**, **Spanish (es)**

### Add Translations
Edit:
- `src/i18n/messages/en.json`
- `src/i18n/messages/es.json`

### Use in Components
```tsx
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('common');
  return <h1>{t('app_name')}</h1>;
}
```

---

## 📦 Key Dependencies

- **Next.js 14+** - App Router
- **Prisma** - MongoDB ORM
- **Zod** - Validation
- **jose** - JWT validation
- **next-intl** - i18n
- **puppeteer-core** - PDF generation
- **cloudinary** - Image/PDF storage
- **Tailwind CSS** - Styling

---

## 🔐 Security

- ✅ JWT validation on all protected endpoints (Auth0)
- ✅ Zod input validation
- ✅ XSS prevention (sanitized HTML)
- ✅ Rate limiting (TODO: add middleware)
- ✅ .env files in .gitignore
- ✅ HTTPS only in production

**⚠️ Legal Disclaimer:**
Simulated currency. Not financial or legal advice. Not a money transmitter.

---

## 🎯 Team Roles (4-person team)

### Backend 1 (BE1)
- Auth middleware ✅
- User/Post CRUD ✅
- Pledge endpoints
- Ledger logic ✅

### Backend 2 (BE2)
- OpenRouter/LLM integration ✅
- PDF generation ✅
- Cloudinary storage ✅
- Seed script ✅

### Frontend 1 (FE1)
- Layout, Header, Footer
- Landing page
- Explore page
- i18n setup ✅

### Frontend 2 (FE2)
- Post create/detail
- Wallet page
- Terms wizard
- Spanish translations ✅

---

## 🚨 Common Issues

### Prisma Generate Fails
```bash
rm -rf node_modules/.prisma
npm run prisma:generate
```

### MongoDB Connection Error
- Check `DATABASE_URL` in `.env.local`
- Whitelist your IP in MongoDB Atlas

### Auth0 Token Invalid
- Verify `AUTH0_DOMAIN`, `AUTH0_AUDIENCE` match
- Check callback URLs in Auth0 dashboard

### LLM Rate Limit
- OpenRouter free tier has limits
- Fallback model kicks in automatically

---

## 📚 Resources

- [Cursor Rules](.cursorrules) - Full PRD & guidelines
- [API Spec](GoLoanMe.yaml) - OpenAPI 3.0.3
- [Auth0 Docs](https://auth0.com/docs)
- [OpenRouter](https://openrouter.ai/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

## 🎉 Demo Script (2-3 minutes)

1. **Sofia** generates contract terms (LLM)
2. **Carmen** creates post (medical category, accepts contracts)
3. **Sam** donates 100 GLM
4. **Sofia** contract-pledges 400 GLM
5. **Carmen** views progress (500/500 funded)
6. Toggle locale EN/ES

---

## 📝 Development Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm start                # Start production server
npm run lint             # Run ESLint
npm run type-check       # TypeScript check
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed demo data
npm run prisma:studio    # Prisma Studio GUI
```

---

## ✅ Setup Checklist

- [ ] `npm install` completed
- [ ] `.env.local` created with all credentials
- [ ] Auth0 tenant configured
- [ ] MongoDB cluster created
- [ ] Cloudinary account set up
- [ ] OpenRouter API key obtained
- [ ] `npm run prisma:generate` successful
- [ ] `npm run prisma:migrate` successful
- [ ] `npm run prisma:seed` successful
- [ ] `npm run dev` server running
- [ ] `/api/health` returns OK

---

**Ready to build! 🚀**

For questions, see `.cursorrules` or ask your team lead.
