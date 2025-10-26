// GET /api/users/{handle} - Get public user profile
// Public endpoint (no authentication required)

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const { handle } = params;

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

    // Omit private fields
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

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/users/[handle] error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch user' } },
      { status: 500 }
    );
  }
}

