// POST /api/admin/users/{handle}/verify-sponsor - Toggle verified sponsor badge
// Protected endpoint - Admin only

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, isAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const user = await authenticateRequest(req);
    const { handle } = params;

    // Check if user is admin
    const userIsAdmin = await isAdmin(user.id);
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    // Find target user
    const targetUser = await db.user.findUnique({
      where: { handle },
      include: { sponsor: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    let sponsorProfile;

    if (targetUser.sponsor) {
      // Toggle existing sponsor verification
      sponsorProfile = await db.sponsorProfile.update({
        where: { userId: targetUser.id },
        data: { verified: !targetUser.sponsor.verified },
      });
    } else {
      // Create new sponsor profile if doesn't exist
      sponsorProfile = await db.sponsorProfile.create({
        data: {
          userId: targetUser.id,
          verified: true,
          rating: null,
        },
      });
    }

    // Return updated user with sponsor status
    const updatedUser = await db.user.findUnique({
      where: { id: targetUser.id },
      include: { sponsor: true },
    });

    if (!updatedUser) {
      throw new Error('User not found after update');
    }

    // Format response (omit private fields)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, auth0_sub, ...userPublic } = updatedUser;

    const response = {
      ...userPublic,
      sponsor: updatedUser.sponsor ? {
        verified: updatedUser.sponsor.verified,
        rating: updatedUser.sponsor.rating,
      } : null,
    };

    const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

    console.log(`✅ Sponsor verified toggled: ${handle} -> ${sponsorProfile.verified} by admin ${user.handle}`);

    return NextResponse.json(response, {
      headers: {
        'X-Request-Id': requestId,
      },
    });
  } catch (error) {
    console.error('POST /api/admin/users/[handle]/verify-sponsor error:', error);

    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to update sponsor status' } },
      { status: 500 }
    );
  }
}

