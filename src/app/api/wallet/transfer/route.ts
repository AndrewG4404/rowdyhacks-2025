// POST /api/wallet/transfer - Internal GLM transfer (admin/dev tool)
// Protected endpoint - Admin only

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { validateBody } from '@/lib/validations';
import { z } from 'zod';
import { createTransfer } from '@/lib/ledger';

const transferSchema = z.object({
  fromAccountId: z.string().uuid(),
  toAccountId: z.string().uuid(),
  amountGLM: z.number().int().min(1),
  note: z.string().min(1).max(500),
});

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    
    // TODO: Add admin role check
    // For now, allow any authenticated user (dev tool)
    
    const data = await validateBody(req, transferSchema);
    
    // Create transfer ledger entries
    const entries = await createTransfer(
      data.fromAccountId,
      data.toAccountId,
      data.amountGLM,
      data.note,
      user.id
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
    console.error('POST /api/wallet/transfer error:', error);
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message.includes('Insufficient balance')) {
      return NextResponse.json(
        { error: { code: 'INSUFFICIENT_BALANCE', message: 'Insufficient balance for transfer' } },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Invalid transfer data' } },
      { status: 400 }
    );
  }
}
