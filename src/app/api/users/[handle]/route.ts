// GET /api/users/{handle} - Get public user profile
// Public endpoint (no authentication required)

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const { handle } = params;

    // Validate handle format (3-30 chars, alphanumeric + underscore/dash)
    const handlePattern = /^[a-zA-Z0-9_-]{3,30}$/;
    if (!handlePattern.test(handle)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid handle format' } },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { handle },
      include: {
        sponsor: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    // Omit private fields (email, auth0_sub)
    const { email, auth0_sub, ...publicProfile } = user;

    const response = {
      ...publicProfile,
      sponsor: user.sponsor
        ? {
            verified: user.sponsor.verified,
            rating: user.sponsor.rating,
          }
        : null,
    };

    // Add request ID header for tracing
    const requestId = req.headers.get('x-request-id') || crypto.randomUUID();
    
    return NextResponse.json(response, {
      headers: {
        'X-Request-Id': requestId,
      },
    });
  } catch (error) {
    console.error('GET /api/users/[handle] error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch user' } },
      { status: 500 }
    );
  }
}

