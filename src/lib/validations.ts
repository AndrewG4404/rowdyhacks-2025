// GoLoanMe - Zod Validation Schemas
// Input validation for all API endpoints

import { z } from 'zod';

// ============================================
// Common Schemas
// ============================================

export const localeSchema = z.enum(['en', 'es']);

export const categorySchema = z.enum([
  'medical',
  'funeral',
  'fun',
  'vet',
  'education',
  'community',
  'other',
]);

export const handleSchema = z
  .string()
  .min(3, 'Handle must be at least 3 characters')
  .max(30, 'Handle must be at most 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Handle can only contain letters, numbers, dashes, and underscores');

export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

// ============================================
// User Schemas
// ============================================

export const updateProfileSchema = z.object({
  handle: handleSchema.optional(),
  avatarUrl: z.string().url().nullable().optional(),
  bio: z.string().max(280).nullable().optional(),
  locale: localeSchema.optional(),
  interests: z.array(z.string().min(2).max(30)).max(10).optional(),
});

// ============================================
// Terms/Contract Schemas
// ============================================

export const termsInputsSchema = z.object({
  title: z.string().min(5).max(100),
  interestPercent: z.number().min(0).max(100).optional(),
  cadence: z.enum(['weekly', 'biweekly', 'monthly', 'quarterly']).optional(),
  graceDays: z.number().int().min(0).max(365).optional(),
  collateralText: z.string().max(500).optional(),
  remedies: z.string().max(1000).optional(),
  disclaimers: z.string().max(1000).optional(),
  locality: z.string().max(100).optional(),
});

// ============================================
// Post Schemas
// ============================================

export const createPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000),
  category: categorySchema,
  goalGLM: z.number().int().min(1).max(1000000).nullable().optional(),
  images: z.array(z.string().url()).max(5).optional(),
  links: z.array(z.string().url()).max(10).optional(),
  acceptContracts: z.boolean().default(false),
});

export const updatePostSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  description: z.string().min(20).max(5000).optional(),
  category: categorySchema.optional(),
  images: z.array(z.string().url()).max(5).optional(),
  links: z.array(z.string().url()).max(10).optional(),
  acceptContracts: z.boolean().optional(),
  status: z.enum(['open', 'closed']).optional(),
});

export const postFiltersSchema = paginationSchema.extend({
  q: z.string().optional(),
  category: categorySchema.optional(),
  status: z.enum(['open', 'closed']).optional(),
});

// ============================================
// Pledge Schemas
// ============================================

export const createPledgeSchema = z.object({
  type: z.enum(['donation', 'contract']),
  amountGLM: z.number().int().min(1, 'Amount must be at least 1 GLM').max(1000000),
  termsId: z.string().optional(),
  note: z.string().max(500).optional(),
}).refine(
  (data) => {
    // If type is contract, termsId is required
    if (data.type === 'contract' && !data.termsId) {
      return false;
    }
    return true;
  },
  {
    message: 'termsId is required for contract pledges',
    path: ['termsId'],
  }
);

// ============================================
// Wallet & Ledger Schemas
// ============================================

export const transferSchema = z.object({
  fromAccountId: z.string(),
  toAccountId: z.string(),
  amountGLM: z.number().int().min(1),
  note: z.string(),
});

export const repaymentSchema = z.object({
  toUserId: z.string(),
  amountGLM: z.number().int().min(1),
  note: z.string(),
});

// ============================================
// Comment & Mention Schemas
// ============================================

export const createCommentSchema = z.object({
  text: z.string().min(1, 'Comment cannot be empty').max(2000),
});

export const createMentionSchema = z.object({
  targets: z.array(handleSchema).min(1).max(20),
});

// ============================================
// Circle Schemas
// ============================================

export const createCircleSchema = z.object({
  name: z.string().min(3).max(50),
});

export const inviteToCircleSchema = z.object({
  handle: handleSchema,
});

// ============================================
// Report Schemas
// ============================================

export const createReportSchema = z.object({
  targetType: z.enum(['post', 'comment', 'user']),
  targetId: z.string(),
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500),
});

// ============================================
// Helper Functions
// ============================================

/**
 * Parse and validate request body with Zod schema
 */
export async function validateBody<T>(
  req: Request,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const body = await req.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new Error(firstError?.message || 'Validation failed');
    }
    throw new Error('Invalid request body');
  }
}

/**
 * Parse and validate query parameters
 */
export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): T {
  const params = Object.fromEntries(searchParams.entries());
  return schema.parse(params);
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  // Basic XSS prevention - remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

/**
 * Extract @mentions from text
 */
export function extractMentions(text: string): string[] {
  const mentionRegex = /@([a-zA-Z0-9_-]{3,30})/g;
  const matches = text.matchAll(mentionRegex);
  return Array.from(matches, (m) => m[1] || '').filter(Boolean);
}

