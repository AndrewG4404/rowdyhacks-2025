// GET /api/me - Get current user profile
// PATCH /api/me - Update current user profile
// Protected endpoints (requires authentication)

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { validateBody, updateProfileSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);

    const profile = await db.user.findUnique({
      where: { id: user.id },
      include: {
        sponsor: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    const response = {
      ...profile,
      sponsor: profile.sponsor
        ? {
            verified: profile.sponsor.verified,
            rating: profile.sponsor.rating,
          }
        : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/me error:', error);
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    const data = await validateBody(req, updateProfileSchema);

    const updated = await db.user.update({
      where: { id: user.id },
      data,
      include: {
        sponsor: true,
      },
    });

    const response = {
      ...updated,
      sponsor: updated.sponsor
        ? {
            verified: updated.sponsor.verified,
            rating: updated.sponsor.rating,
          }
        : null,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('PATCH /api/me error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: error.message } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update profile' } },
      { status: 500 }
    );
  }
}

