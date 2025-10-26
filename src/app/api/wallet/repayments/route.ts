// POST /api/wallet/repayments - Create a repayment transfer (post owner -> sponsor)
// Protected endpoint - Demo only

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { validateBody } from '@/lib/validations';
import { z } from 'zod';
import { createRepayment } from '@/lib/ledger';

const repaymentSchema = z.object({
  toUserId: z.string().uuid(),
  amountGLM: z.number().int().min(1),
  note: z.string().min(1).max(500),
});

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    const data = await validateBody(req, repaymentSchema);
    
    // Create repayment ledger entries (from current user to target user)
    const entries = await createRepayment(
      user.id,
      data.toUserId,
      data.amountGLM,
      data.note
    );

    const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

    return NextResponse.json({
      entries,
    }, {
      status: 201,
      headers: {
        'X-Request-Id': requestId,
      },
    });
  } catch (error) {
    console.error('POST /api/wallet/repayments error:', error);
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message.includes('Insufficient balance')) {
      return NextResponse.json(
        { error: { code: 'INSUFFICIENT_BALANCE', message: 'Insufficient balance for repayment' } },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Invalid repayment data' } },
      { status: 400 }
    );
  }
}
