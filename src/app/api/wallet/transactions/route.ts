// GET /api/wallet/transactions - Get my ledger entries
// Protected endpoint

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { validateQuery } from '@/lib/validations';
import { z } from 'zod';
import { db } from '@/lib/db';

const transactionsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    const searchParams = req.nextUrl.searchParams;
    const { limit, cursor } = validateQuery(searchParams, transactionsQuerySchema);

    // Get user's account
    const account = await db.account.findFirst({
      where: {
        ownerType: 'user',
        ownerId: user.id,
      },
    });

    if (!account) {
      return NextResponse.json({
        items: [],
        nextCursor: null,
      });
    }

    // Build cursor filter for pagination
    let cursorFilter: any = {};
    if (cursor) {
      cursorFilter = {
        id: { lt: cursor },
      };
    }

    // Get ledger entries for user's account
    const entries = await db.ledgerEntry.findMany({
      where: {
        accountId: account.id,
        ...cursorFilter,
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
    });

    const hasMore = entries.length > limit;
    const items = hasMore ? entries.slice(0, -1) : entries;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

    return NextResponse.json({
      items,
      nextCursor,
    }, {
      headers: {
        'X-Request-Id': requestId,
      },
    });
  } catch (error) {
    console.error('GET /api/wallet/transactions error:', error);
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch transactions' } },
      { status: 500 }
    );
  }
}
