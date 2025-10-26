// GoLoanMe - TypeScript Type Definitions
// Extends Prisma types and defines API contracts

import { User, Post, Pledge, TermsTemplate, Comment, Circle } from '@prisma/client';

// ============================================
// API Response Types
// ============================================

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface ApiSuccess<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
}

// ============================================
// User Types
// ============================================

export type UserPublic = Omit<User, 'email' | 'auth0_sub'> & {
  sponsor: {
    verified: boolean;
    rating: number | null;
  } | null;
};

export type Me = User & {
  sponsor: {
    verified: boolean;
    rating: number | null;
  } | null;
};

// ============================================
// Terms/Contract Types
// ============================================

export interface TermsInputs {
  title: string;
  interestPercent?: number;
  cadence?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  graceDays?: number;
  collateralText?: string;
  remedies?: string;
  disclaimers?: string;
  locality?: string;
}

export type TermsTemplateWithUser = TermsTemplate & {
  user: UserPublic;
};

// ============================================
// Post Types
// ============================================

export interface PostStats {
  fundedGLM: number;
  donors: number;
  sponsors: number;
}

export type PostWithOwner = Post & {
  owner: UserPublic;
  stats?: PostStats;
};

// Export Post from Prisma for component usage
export type { Post } from '@prisma/client';

// Extended Post type with additional frontend properties
export type PostExtended = Post & {
  owner?: UserPublic;
  stats?: PostStats;
  totalRaised?: number; // Alias for stats.fundedGLM
  goal?: number; // Alias for goalGLM
};

export interface CreatePostInput {
  title: string;
  description: string;
  category: string;
  goalGLM?: number;
  images?: string[];
  links?: string[];
  acceptContracts?: boolean;
}

export interface UpdatePostInput {
  title?: string;
  description?: string;
  category?: string;
  images?: string[];
  links?: string[];
  acceptContracts?: boolean;
  status?: 'open' | 'closed';
}

// ============================================
// Pledge Types
// ============================================

export interface CreatePledgeInput {
  type: 'donation' | 'contract';
  amountGLM: number;
  termsId?: string;
  note?: string;
}

export interface PledgeTermsSummary {
  termsId: string;
  title: string;
  interestPercent: number;
  cadence: string;
  graceDays: number;
}

export type PledgeWithDetails = Pledge & {
  pledger: UserPublic;
  termsSummary?: PledgeTermsSummary | null;
};

// ============================================
// Wallet & Ledger Types
// ============================================

export interface WalletBalance {
  balanceGLM: number;
  accountId: string;
}

export interface TransferInput {
  fromAccountId: string;
  toAccountId: string;
  amountGLM: number;
  note: string;
}

export interface RepaymentInput {
  toUserId: string;
  amountGLM: number;
  note: string;
}

// ============================================
// Comment & Mention Types
// ============================================

export type CommentWithAuthor = Comment & {
  author: UserPublic;
};

export interface CreateCommentInput {
  text: string;
}

export interface CreateMentionInput {
  targets: string[]; // Array of handles
}

// ============================================
// Circle Types
// ============================================

export type CircleWithMembers = Circle & {
  owner: UserPublic;
  members: UserPublic[];
};

export interface CreateCircleInput {
  name: string;
}

export interface InviteToCircleInput {
  handle: string;
}

// ============================================
// Report Types
// ============================================

export interface CreateReportInput {
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  reason: string;
}

// ============================================
// Auth Types
// ============================================

export interface JWTPayload {
  sub: string; // auth0_sub
  email?: string;
  [key: string]: unknown;
}

export interface AuthenticatedRequest {
  user: {
    id: string;
    auth0_sub: string;
    email: string;
    handle: string;
    locale: 'en' | 'es';
  };
}

// ============================================
// LLM Types
// ============================================

export interface LLMGenerateRequest {
  inputs: TermsInputs;
  model?: string;
}

export interface LLMGenerateResponse {
  html: string;
  json: TermsInputs;
  model: string;
}

// ============================================
// Cloudinary Types
// ============================================

export interface CloudinarySignature {
  timestamp: number;
  signature: string;
  cloudName: string;
  apiKey: string;
  folder?: string;
}

// ============================================
// Pagination Types
// ============================================

export interface CursorPaginationParams {
  limit?: number;
  cursor?: string;
}

export interface PostListFilters extends CursorPaginationParams {
  q?: string;
  category?: string;
  status?: 'open' | 'closed';
}

