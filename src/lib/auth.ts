// GoLoanMe - Auth0 JWT Validation
// Validates JWTs from Auth0 and extracts user info

import { jwtVerify, createRemoteJWKSet } from 'jose';
import { NextRequest } from 'next/server';
import { db } from './db';
import type { JWTPayload, AuthenticatedRequest } from '@/types';

// Environment variables
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
const AUTH0_ISSUER = process.env.AUTH0_ISSUER || `https://${AUTH0_DOMAIN}/`;

if (!AUTH0_DOMAIN || !AUTH0_AUDIENCE) {
  console.warn('⚠️ Auth0 environment variables not configured');
}

// JWKS endpoint for Auth0 public keys
const JWKS = createRemoteJWKSet(
  new URL(`https://${AUTH0_DOMAIN}/.well-known/jwks.json`)
);

/**
 * Validates JWT token from Authorization header
 */
export async function validateToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      audience: AUTH0_AUDIENCE,
      issuer: AUTH0_ISSUER,
    });

    if (!payload.sub) {
      throw new Error('Token missing sub claim');
    }

    return payload as JWTPayload;
  } catch (error) {
    console.error('JWT validation failed:', error);
    throw new Error('Invalid or expired token');
  }
}

/**
 * Extracts and validates JWT from request headers
 */
export async function authenticateRequest(
  req: NextRequest
): Promise<AuthenticatedRequest['user']> {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Missing bearer token');
  }

  // Validate JWT
  const payload = await validateToken(token);

  // Get or create user in database
  const user = await getOrCreateUser(payload);

  return user;
}

/**
 * Get user from database or create if first login
 */
async function getOrCreateUser(payload: JWTPayload): Promise<AuthenticatedRequest['user']> {
  const auth0_sub = payload.sub;
  const email = payload.email || `${auth0_sub}@temp.local`;

  let user = await db.user.findUnique({
    where: { auth0_sub },
  });

  if (!user) {
    // First login - create user
    const handle = generateHandle(email);
    
    user = await db.user.create({
      data: {
        auth0_sub,
        email,
        handle,
        locale: 'en',
      },
    });

    // Create user account for GLM credits
    await db.account.create({
      data: {
        ownerType: 'user',
        ownerId: user.id,
        balanceGLM: 1000, // Starting balance for demo
      },
    });

    console.log(`✅ Created new user: ${user.handle} (${user.id})`);
  }

  return {
    id: user.id,
    auth0_sub: user.auth0_sub,
    email: user.email,
    handle: user.handle,
    locale: user.locale,
  };
}

/**
 * Generate unique handle from email
 */
function generateHandle(email: string): string {
  const base = email.split('@')[0]?.replace(/[^a-z0-9_-]/gi, '_') || 'user';
  const random = Math.random().toString(36).substring(2, 6);
  return `${base}_${random}`;
}

/**
 * Check if user is admin (for admin endpoints)
 */
export async function isAdmin(userId: string): Promise<boolean> {
  // TODO: Implement admin role logic
  // For now, check if user has specific email or handle
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  // Replace with your admin email/handle
  const adminHandles = ['admin', 'andrew_g'];
  return user ? adminHandles.includes(user.handle) : false;
}

/**
 * Require admin access or throw error
 */
export async function requireAdmin(userId: string): Promise<void> {
  const admin = await isAdmin(userId);
  if (!admin) {
    throw new Error('Admin access required');
  }
}

