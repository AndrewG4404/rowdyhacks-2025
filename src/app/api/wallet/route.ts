// GET /api/wallet - Get user wallet balance
// Protected endpoint

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { getBalance, getOrCreateAccount } from '@/lib/ledger';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);

    // Get or create user account with initial balance
    const accountId = await getOrCreateAccount('user', user.id, 1000);
    const balanceGLM = await getBalance('user', user.id);

    // Add request ID header for tracing
    const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

    return NextResponse.json({
      account: {
        id: accountId,
        ownerType: 'user',
        ownerId: user.id,
        balanceGLM,
      },
    }, {
      headers: {
        'X-Request-Id': requestId,
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '99',
      },
    });
  } catch (error) {
    console.error('GET /api/wallet error:', error);
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch wallet' } },
      { status: 500 }
    );
  }
}

