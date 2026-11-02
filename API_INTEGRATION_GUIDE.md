# Frontend → Backend API Integration Guide

## 🎯 Overview
Your backend APIs are **ready and documented** in `GoLoanMe.yaml`. This guide shows exactly where to integrate each endpoint in the frontend.

---

## 🔑 Authentication
All protected endpoints require JWT from Auth0:
```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## 📋 API Endpoints → Frontend Pages

### **1. Health Check**
**Endpoint:** `GET /api/v1/health`  
**Auth:** Public  
**Frontend:** Can add to Header component for monitoring

```typescript
// Optional: Add to Header.tsx for status indicator
const checkHealth = async () => {
  const res = await fetch('/api/v1/health');
  return res.json(); // { status: "ok", version: "1.0.0", timestamp: "..." }
};
```

---

### **2. User Profile - Get Current User**
**Endpoint:** `GET /api/v1/me`  
**Auth:** Required  
**Frontend:** Header, Profile components

```typescript
// src/components/layout/Header.tsx
const getMe = async (token: string) => {
  const res = await fetch('/api/v1/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json(); // Returns Me schema with email, auth0_sub, etc.
};
```

---

### **3. User Profile - Update Current User**
**Endpoint:** `PATCH /api/v1/me`  
**Auth:** Required  
**Frontend:** Profile edit page

```typescript
// src/app/profile/edit/page.tsx (create this)
const updateProfile = async (token: string, data: { handle?, bio?, locale?, interests? }) => {
  const res = await fetch('/api/v1/me', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return res.json();
};
```

---

### **4. Get Public User Profile**
**Endpoint:** `GET /api/v1/users/{handle}`  
**Auth:** Public  
**Frontend:** `src/app/profile/[handle]/page.tsx`

```typescript
// REPLACE mock data in src/app/profile/[handle]/page.tsx
export default async function ProfilePage({ params }: ProfilePageProps) {
  const { handle } = await params;
  
  // Replace mock with real API call
  const user = await fetch(`/api/v1/users/${handle}`)
    .then(r => r.json()); // Returns UserPublic schema
  
  // ... rest of component
}
```

---

### **5. List Posts (Browse)**
**Endpoint:** `GET /api/v1/posts?q={query}&category={cat}&status={status}&limit={limit}&cursor={cursor}`  
**Auth:** Public  
**Frontend:** `src/app/explore/page.tsx`

```typescript
// REPLACE mock data in src/app/explore/page.tsx
const fetchPosts = async (query?: string, category?: string, status?: string) => {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (category && category !== 'all') params.set('category', category);
  if (status && status !== 'all') params.set('status', status);
  
  const res = await fetch(`/api/v1/posts?${params}`);
  return res.json(); // Returns { items: Post[], nextCursor: string | null }
};
```

---

### **6. Create Post**
**Endpoint:** `POST /api/v1/posts`  
**Auth:** Required  
**Frontend:** `src/app/posts/new/page.tsx`

```typescript
// REPLACE mock in src/app/posts/new/page.tsx handleSubmit
const createPost = async (token: string, data: {
  title: string,
  description: string,
  category: string,
  goalGLM?: number,
  images?: string[],
  links?: string[],
  acceptContracts: boolean
}) => {
  const res = await fetch('/api/v1/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': crypto.randomUUID() // Prevent duplicates
    },
    body: JSON.stringify({
      ...data,
      category: data.category.toLowerCase() // API expects: medical, funeral, fun, vet, education, community, other
    })
  });
  return res.json(); // Returns Post schema
};
```

---

### **7. Get Post Detail**
**Endpoint:** `GET /api/v1/posts/{id}`  
**Auth:** Public  
**Frontend:** `src/app/posts/[id]/page.tsx`

```typescript
// REPLACE mock data in src/app/posts/[id]/page.tsx
export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  
  const post = await fetch(`/api/v1/posts/${id}`)
    .then(r => r.json()); // Returns Post schema with owner, stats, etc.
  
  // ... rest of component
}
```

---

### **8. List Pledges for a Post**
**Endpoint:** `GET /api/v1/posts/{id}/pledges`  
**Auth:** Public  
**Frontend:** `src/app/posts/[id]/page.tsx`

```typescript
// REPLACE mockPledges in src/app/posts/[id]/page.tsx
const fetchPledges = async (postId: string) => {
  const res = await fetch(`/api/v1/posts/${postId}/pledges`);
  return res.json(); // Returns { items: Pledge[], nextCursor: string | null }
};
```

---

### **9. Create Pledge (Donation or Contract)**
**Endpoint:** `POST /api/v1/posts/{id}/pledges`  
**Auth:** Required  
**Frontend:** `src/app/posts/[id]/page.tsx`

```typescript
// REPLACE handlePledge in src/app/posts/[id]/page.tsx
const createPledge = async (
  token: string,
  postId: string,
  data: {
    type: 'donation' | 'contract',
    amountGLM: number,
    termsId?: string, // Required if type='contract'
    note?: string
  }
) => {
  const res = await fetch(`/api/v1/posts/${postId}/pledges`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': crypto.randomUUID() // Critical! Prevents double-charging
    },
    body: JSON.stringify(data)
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error.message);
  }
  
  return res.json(); // Returns Pledge schema
};
```

---

### **10. Get Wallet Balance**
**Endpoint:** `GET /api/v1/wallet`  
**Auth:** Required  
**Frontend:** `src/app/wallet/page.tsx`

```typescript
// REPLACE mockBalance in src/app/wallet/page.tsx
const fetchWallet = async (token: string) => {
  const res = await fetch('/api/v1/wallet', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json(); // Returns { account: Account } with balanceGLM
};
```

---

### **11. Get Ledger Transactions**
**Endpoint:** `GET /api/v1/wallet/transactions?limit={limit}&cursor={cursor}`  
**Auth:** Required  
**Frontend:** `src/app/wallet/page.tsx`

```typescript
// REPLACE mockLedgerEntries in src/app/wallet/page.tsx
const fetchTransactions = async (token: string) => {
  const res = await fetch('/api/v1/wallet/transactions', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json(); // Returns { items: LedgerEntry[], nextCursor: string | null }
};
```

---

### **12. Create Terms Template (AI Generation)**
**Endpoint:** `POST /api/v1/terms`  
**Auth:** Required  
**Frontend:** `src/app/terms/page.tsx`

```typescript
// REPLACE handleGenerate in src/app/terms/page.tsx
const generateTerms = async (token: string, data: {
  title: string,
  interestPercent?: number,
  cadence?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly',
  graceDays?: number,
  collateralText?: string,
  remedies?: string,
  disclaimers?: string,
  locality?: string
}) => {
  const res = await fetch('/api/v1/terms', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': crypto.randomUUID() // Prevent duplicate LLM calls
    },
    body: JSON.stringify(data)
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error.message);
  }
  
  return res.json(); // Returns TermsTemplate with html, pdfUrl, etc.
};
```

---

### **13. Get My Terms Templates**
**Endpoint:** `GET /api/v1/terms/me`  
**Auth:** Required  
**Frontend:** Terms list page (create if needed)

```typescript
const fetchMyTerms = async (token: string) => {
  const res = await fetch('/api/v1/terms/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json(); // Returns TermsTemplate[]
};
```

---

## 🔄 Category Name Mapping

**Frontend uses display names, API uses lowercase keys:**

| Frontend (UI) | API Value |
|--------------|-----------|
| Medical | `medical` |
| Funeral | `funeral` |
| For fun | `fun` |
| Vet bills | `vet` |
| Education | `education` |
| Community Projects | `community` |
| Other | `other` |

**Convert in your code:**
```typescript
const categoryToApi = (uiCategory: string) => {
  const map: Record<string, string> = {
    'Medical': 'medical',
    'Funeral': 'funeral',
    'For fun': 'fun',
    'Vet bills': 'vet',
    'Education': 'education',
    'Community Projects': 'community',
    'Other': 'other'
  };
  return map[uiCategory] || 'other';
};
```

---

## 🛡️ Error Handling

All errors follow this schema:
```typescript
{
  error: {
    code: string, // e.g., "UNAUTHORIZED", "VALIDATION_ERROR"
    message: string, // Human-readable message
    details?: object // Optional additional info
  }
}
```

**Handle in frontend:**
```typescript
try {
  const result = await createPost(token, data);
} catch (error) {
  if (error.error?.code === 'VALIDATION_ERROR') {
    // Show validation errors
  } else if (error.error?.code === 'UNAUTHORIZED') {
    // Redirect to login
  } else {
    // Show generic error
  }
}
```

---

## 📊 Pagination

API uses cursor-based pagination:
```typescript
{
  items: T[],
  nextCursor: string | null // null = last page
}
```

**Frontend pattern:**
```typescript
const [items, setItems] = useState([]);
const [cursor, setCursor] = useState(null);

const loadMore = async () => {
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', cursor);
  
  const res = await fetch(`/api/v1/posts?${params}`);
  const data = await res.json();
  
  setItems([...items, ...data.items]);
  setCursor(data.nextCursor);
};
```

---

## 🔌 Quick Integration Checklist

For each page:

- [ ] **Explore page** - Replace mockPosts with `GET /api/v1/posts`
- [ ] **Post detail** - Replace mockPost with `GET /api/v1/posts/{id}`
- [ ] **Post detail** - Replace mockPledges with `GET /api/v1/posts/{id}/pledges`
- [ ] **Post detail** - Replace handlePledge with `POST /api/v1/posts/{id}/pledges`
- [ ] **Create post** - Replace handleSubmit with `POST /api/v1/posts`
- [ ] **Wallet page** - Replace mockBalance with `GET /api/v1/wallet`
- [ ] **Wallet page** - Replace mockLedgerEntries with `GET /api/v1/wallet/transactions`
- [ ] **Profile page** - Replace mockUser with `GET /api/v1/users/{handle}`
- [ ] **Terms page** - Replace handleGenerate with `POST /api/v1/terms`

---

## 🎯 Next Steps

1. **Get Auth0 token** - Set up Auth0 in frontend to get JWT tokens
2. **Replace mock data** - Use the code examples above
3. **Add error handling** - Show user-friendly error messages
4. **Test each flow** - Create post → Make pledge → Check wallet
5. **Add loading states** - Show spinners during API calls

---

**All API endpoints are documented in `GoLoanMe.yaml`**. Refer to it for detailed request/response schemas! 🚀

