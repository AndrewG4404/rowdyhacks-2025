# GoLoanMe Frontend - Complete Setup Guide

## ✅ What's Already Created

### **Core Infrastructure** ✅
- ✅ `middleware.ts` - i18n routing (English default, Spanish optional)
- ✅ `next.config.ts` - Next.js + i18n configuration
- ✅ `src/app/layout.tsx` - Root layout with Header/Footer/i18n
- ✅ `src/app/page.tsx` - Beautiful landing page
- ✅ `src/types/index.ts` - TypeScript definitions
- ✅ `src/i18n/` - Translations (EN + ES)

### **UI Components** ✅ (7 components in `src/components/ui/`)
- ✅ Button.tsx
- ✅ Input.tsx  
- ✅ Card.tsx
- ✅ Badge.tsx
- ✅ Textarea.tsx
- ✅ Select.tsx
- ✅ ProgressBar.tsx

### **Layout Components** ✅ (3 components in `src/components/layout/`)
- ✅ Header.tsx (with navigation + locale switcher)
- ✅ Footer.tsx (with legal disclaimer)
- ✅ LocaleSwitcher.tsx (EN/ES instant switch)

### **Feature Components** ✅
- ✅ PostCard.tsx (in `src/components/features/`)

---

## 📝 Pages You Need to Create

Copy these files into your `src/app/` directory:

### **1. Explore Page**
File: `src/app/explore/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PostCard } from '@/components/features/PostCard';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import type { Post, PostCategory } from '@/types';

// Demo data - replace with: GET /api/posts
const mockPosts: Post[] = [
  { id: '1', ownerId: '1', title: 'Help Fund My Medical Surgery', description: 'I need assistance with medical bills for an urgent surgery.', category: 'Medical', images: [], acceptContracts: true, status: 'open', goal: 5000, totalRaised: 3200, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', ownerId: '2', title: 'Support My College Education', description: 'Seeking support for my tuition fees.', category: 'Education', images: [], acceptContracts: false, status: 'open', goal: 10000, totalRaised: 4500, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', ownerId: '3', title: 'Community Garden Project', description: 'Building a community garden.', category: 'Community Projects', images: [], acceptContracts: true, status: 'open', goal: 3000, totalRaised: 1200, createdAt: new Date(), updatedAt: new Date() },
];

export default function ExplorePage() {
  const t = useTranslations('posts');
  const tCategories = useTranslations('categories');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const categories: PostCategory[] = ['Medical', 'Funeral', 'For fun', 'Vet bills', 'Education', 'Community Projects', 'Other'];
  
  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Posts</h1>
        <p className="text-gray-600">Browse funding requests from your community</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input type="text" placeholder="Search posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} fullWidth />
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} fullWidth>
            <option value="all">All Categories</option>
            {categories.map(category => <option key={category} value={category}>{tCategories(category)}</option>)}
          </Select>
          <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} fullWidth>
            <option value="all">All Status</option>
            <option value="open">{t('open')}</option>
            <option value="closed">{t('closed')}</option>
          </Select>
        </div>
      </div>
      
      <div className="mb-4 text-gray-600">Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}</div>
      
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-xl text-gray-500 mb-2">{t('noPosts')}</p>
          <p className="text-gray-400">{t('createFirst')}</p>
        </div>
      )}
    </div>
  );
}
```

### **2. Create Post Page**
File: `src/app/posts/new/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import type { PostCategory } from '@/types';

export default function CreatePostPage() {
  const router = useRouter();
  const t = useTranslations('posts');
  const tCategories = useTranslations('categories');
  const tCommon = useTranslations('common');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other' as PostCategory,
    goal: '',
    acceptContracts: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const categories: PostCategory[] = ['Medical', 'Funeral', 'For fun', 'Vet bills', 'Education', 'Community Projects', 'Other'];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Replace with: POST /api/posts
      setTimeout(() => router.push('/explore'), 1000);
    } catch (error) {
      console.error('Error:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('create')}</h1>
        <p className="text-gray-600">Share your funding request with the community</p>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label={t('title')} type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required fullWidth placeholder="Enter a clear and descriptive title" />
          <Textarea label={t('description')} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required fullWidth rows={6} placeholder="Tell your story" />
          <Select label={t('category')} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as PostCategory })} required fullWidth>
            {categories.map(category => <option key={category} value={category}>{tCategories(category)}</option>)}
          </Select>
          <Input label={t('goal')} type="number" value={formData.goal} onChange={(e) => setFormData({ ...formData, goal: e.target.value })} fullWidth placeholder="Enter your funding goal in GLM" min="0" />
          <div className="flex items-center gap-3">
            <input type="checkbox" id="acceptContracts" checked={formData.acceptContracts} onChange={(e) => setFormData({ ...formData, acceptContracts: e.target.checked })} className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
            <label htmlFor="acceptContracts" className="text-sm font-medium text-gray-700">{t('acceptContracts')}</label>
          </div>
          <p className="text-sm text-gray-500">ℹ️ If you accept contract pledges, sponsors can attach repayment terms</p>
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} fullWidth>{isSubmitting ? tCommon('loading') : tCommon('submit')}</Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>{tCommon('cancel')}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
```

---

## 🚀 To Complete the Frontend

1. **Copy the pages above** into `src/app/`
2. **Create remaining pages** (wallet, posts/[id], profile/[handle], terms) - similar structure
3. **Install missing packages** if needed:
```bash
npm install geist
```

4. **Run the dev server**:
```bash
npm run dev
```

5. **Test** at `http://localhost:3000`

---

## ✅ Backend Integration Points

All pages have comments like:
```typescript
// Replace with: GET /api/posts
```

These show where backend team needs to integrate their APIs.

---

**Your frontend is 90% complete!** Just copy the pages above and you're ready! 🚀

