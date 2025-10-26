// GET /api/wallet - Get user wallet balance
// Protected endpoint

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { getBalance, getOrCreateAccount } from '@/lib/ledger';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);

    const accountId = await getOrCreateAccount('user', user.id, 1000);
    const balanceGLM = await getBalance('user', user.id);

    return NextResponse.json({
      account: {
        id: accountId,
        ownerType: 'user',
        ownerId: user.id,
        balanceGLM,
      },
    });
  } catch (error) {
    console.error('GET /api/wallet error:', error);
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    );
  }
}

