// POST /api/wallet/fund - Add GLM credits to user account (demo/dev tool)
// Protected endpoint

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { validateBody } from '@/lib/validations';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getOrCreateAccount } from '@/lib/ledger';

const fundSchema = z.object({
  amountGLM: z.number().int().min(1).max(10000), // Max 10,000 GLM for demo
  note: z.string().optional().default('Demo funding'),
});

export async function POST(req: NextRequest) {
  try {
    console.log('Funding endpoint called');
    const user = await authenticateRequest(req);
    console.log('User authenticated:', user.id);
    
    // Parse request body manually
    const body = await req.json();
    console.log('Parsed body:', body);
    
    const data = fundSchema.parse(body);
    console.log('Data validated:', data);
    
    // Get or create user account
    const accountId = await getOrCreateAccount('user', user.id);
    console.log('Account ID:', accountId);
    
    // Get current account to check balance
    const account = await db.account.findUnique({
      where: { id: accountId },
    });
    
    if (!account) {
      throw new Error('Account not found');
    }
    
    console.log('Current balance:', account.balanceGLM);
    
    // Create a credit entry to add funds
    const ledgerEntry = await db.ledgerEntry.create({
      data: {
        accountId: accountId,
        direction: 'credit',
        amountGLM: data.amountGLM,
        refType: 'transfer',
        refId: accountId, // Use account ID as reference for funding
      },
    });

    console.log('Ledger entry created:', ledgerEntry.id);

    // Update account balance
    const updatedAccount = await db.account.update({
      where: { id: accountId },
      data: {
        balanceGLM: {
          increment: data.amountGLM,
        },
      },
    });

    console.log('Account updated, new balance:', updatedAccount.balanceGLM);

    const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

    return NextResponse.json({
      success: true,
      amountGLM: data.amountGLM,
      newBalance: updatedAccount.balanceGLM,
      ledgerEntry,
    }, {
      status: 201,
      headers: {
        'X-Request-Id': requestId,
      },
    });
  } catch (error) {
    console.error('POST /api/wallet/fund error:', error);
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Invalid funding data' } },
      { status: 400 }
    );
  }
}
