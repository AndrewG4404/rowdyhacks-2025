// GET /api/terms/me - List my terms templates
// Protected endpoint

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);

    const termsTemplates = await db.termsTemplate.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

    return NextResponse.json(termsTemplates, {
      headers: {
        'X-Request-Id': requestId,
      },
    });
  } catch (error) {
    console.error('GET /api/terms/me error:', error);

    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch terms templates' } },
      { status: 500 }
    );
  }
}

