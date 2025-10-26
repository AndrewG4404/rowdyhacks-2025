// POST /api/posts/{id}/pledges - Create pledge (donation or contract)
// GET /api/posts/{id}/pledges - List pledges for post

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { validateBody } from '@/lib/validations';
import { z } from 'zod';
import { processDonation, processContractPledge } from '@/lib/ledger';

const createPledgeSchema = z.object({
  type: z.enum(['donation', 'contract']),
  amountGLM: z.number().int().min(1, 'Amount must be at least 1 GLM').max(1000000),
  termsId: z.string().optional(),
  note: z.string().max(500).optional(),
}).refine(
  (data) => {
    // If type is contract, termsId is required
    if (data.type === 'contract' && !data.termsId) {
      return false;
    }
    return true;
  },
  {
    message: 'termsId is required for contract pledges',
    path: ['termsId'],
  }
);

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: postId } = params;

    // Check if post exists
    const post = await db.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Post not found' } },
        { status: 404 }
      );
    }

    // Get pledges with pledger info
    const pledges = await db.pledge.findMany({
      where: { postId },
      include: {
        pledger: {
          include: {
            sponsor: true,
          },
        },
        termsTemplate: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format response with public pledger data
    const items = pledges.map((pledge) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, auth0_sub, ...pledgerPublic } = pledge.pledger;

      return {
        id: pledge.id,
        postId: pledge.postId,
        pledger: {
          ...pledgerPublic,
          sponsor: pledge.pledger.sponsor ? {
            verified: pledge.pledger.sponsor.verified,
            rating: pledge.pledger.sponsor.rating,
          } : null,
        },
        type: pledge.type,
        amountGLM: pledge.amountGLM,
        termsSummary: pledge.termsTemplate ? {
          termsId: pledge.termsTemplate.id,
          title: pledge.termsTemplate.title,
          interestPercent: (pledge.termsTemplate.inputs as any).interestPercent || 0,
          cadence: (pledge.termsTemplate.inputs as any).cadence || 'monthly',
          graceDays: (pledge.termsTemplate.inputs as any).graceDays || 0,
        } : null,
        note: pledge.note,
        createdAt: pledge.createdAt,
      };
    });

    const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

    return NextResponse.json({
      items,
      nextCursor: null, // No pagination for MVP
    }, {
      headers: {
        'X-Request-Id': requestId,
      },
    });
  } catch (error) {
    console.error('GET /api/posts/[id]/pledges error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch pledges' } },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(req);
    const { id: postId } = params;
    const data = await validateBody(req, createPledgeSchema);

    // Check if post exists
    const post = await db.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Post not found' } },
        { status: 404 }
      );
    }

    // Check if post is still open
    if (post.status !== 'open') {
      return NextResponse.json(
        { error: { code: 'CONFLICT', message: 'Post is closed for pledges' } },
        { status: 409 }
      );
    }

    // If contract pledge, verify post accepts contracts and terms exist
    if (data.type === 'contract') {
      if (!post.acceptContracts) {
        return NextResponse.json(
          { error: { code: 'CONFLICT', message: 'Post does not accept contract pledges' } },
          { status: 409 }
        );
      }

      // Verify terms template exists and belongs to user
      const termsTemplate = await db.termsTemplate.findUnique({
        where: { id: data.termsId },
      });

      if (!termsTemplate) {
        return NextResponse.json(
          { error: { code: 'NOT_FOUND', message: 'Terms template not found' } },
          { status: 404 }
        );
      }

      if (termsTemplate.userId !== user.id) {
        return NextResponse.json(
          { error: { code: 'FORBIDDEN', message: 'You do not own this terms template' } },
          { status: 403 }
        );
      }
    }

    // Create pledge record first
    const pledge = await db.pledge.create({
      data: {
        postId,
        pledgerId: user.id,
        type: data.type,
        amountGLM: data.amountGLM,
        termsId: data.termsId || null,
        note: data.note || null,
      },
      include: {
        pledger: {
          include: {
            sponsor: true,
          },
        },
        termsTemplate: true,
      },
    });

    // Process the pledge (transfer GLM)
    try {
      if (data.type === 'donation') {
        await processDonation(user.id, postId, data.amountGLM, pledge.id);
      } else {
        await processContractPledge(user.id, postId, data.amountGLM, pledge.id);
      }
    } catch (ledgerError: unknown) {
      // If ledger fails, delete the pledge record
      await db.pledge.delete({ where: { id: pledge.id } });
      
      if (ledgerError instanceof Error && ledgerError.message.includes('Insufficient balance')) {
        return NextResponse.json(
          { error: { code: 'INSUFFICIENT_BALANCE', message: 'Insufficient GLM balance', details: { available: ledgerError.message } } },
          { status: 409 }
        );
      }

      throw ledgerError;
    }

    // Format response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, auth0_sub, ...pledgerPublic } = pledge.pledger;

    const response = {
      id: pledge.id,
      postId: pledge.postId,
      pledger: {
        ...pledgerPublic,
        sponsor: pledge.pledger.sponsor ? {
          verified: pledge.pledger.sponsor.verified,
          rating: pledge.pledger.sponsor.rating,
        } : null,
      },
      type: pledge.type,
      amountGLM: pledge.amountGLM,
      termsSummary: pledge.termsTemplate ? {
        termsId: pledge.termsTemplate.id,
        title: pledge.termsTemplate.title,
        interestPercent: (pledge.termsTemplate.inputs as any).interestPercent || 0,
        cadence: (pledge.termsTemplate.inputs as any).cadence || 'monthly',
        graceDays: (pledge.termsTemplate.inputs as any).graceDays || 0,
      } : null,
      note: pledge.note,
      createdAt: pledge.createdAt,
    };

    const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

    console.log(`✅ Pledge created: ${pledge.type} of ${data.amountGLM} GLM by ${user.handle}`);

    return NextResponse.json(response, {
      status: 201,
      headers: {
        'X-Request-Id': requestId,
      },
    });
  } catch (error: unknown) {
    console.error('POST /api/posts/[id]/pledges error:', error);

    if (error instanceof Error) {
      if (error.message.includes('Authentication required')) {
        return NextResponse.json(
          { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: error.message } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create pledge' } },
      { status: 500 }
    );
  }
}

