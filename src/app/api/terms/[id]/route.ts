// GET /api/terms/{id} - Get individual terms template
// Protected endpoint

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(req);
    const { id } = params;

    const termsTemplate = await db.termsTemplate.findUnique({
      where: { id },
    });

    if (!termsTemplate) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Terms template not found' } },
        { status: 404 }
      );
    }

    // Only owner can view their own terms
    // (In future, could allow public view for transparency)
    if (termsTemplate.userId !== user.id) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'You do not own this terms template' } },
        { status: 403 }
      );
    }

    const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

    return NextResponse.json(termsTemplate, {
      headers: {
        'X-Request-Id': requestId,
      },
    });
  } catch (error) {
    console.error('GET /api/terms/[id] error:', error);

    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch terms template' } },
      { status: 500 }
    );
  }
}

