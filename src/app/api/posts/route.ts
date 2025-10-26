// GET /api/posts - List posts (public)
// POST /api/posts - Create post (protected)

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { validateBody, validateQuery, createPostSchema, postFiltersSchema } from '@/lib/validations';
import { getOrCreateAccount } from '@/lib/ledger';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const { limit, cursor, q, category, status } = validateQuery(searchParams, postFiltersSchema);

    const where = {
      ...(q && {
        OR: [
          { title: { contains: q, mode: 'insensitive' as const } },
          { description: { contains: q, mode: 'insensitive' as const } },
        ],
      }),
      ...(category && { category }),
      ...(status && { status }),
      ...(cursor && {
        id: { lt: cursor },
      }),
    };

    const posts = await db.post.findMany({
      where,
      include: {
        owner: {
          include: {
            sponsor: true,
          },
        },
        pledges: true,
      },
      orderBy: { createdAt: 'desc' },
      take: (limit || 20) + 1,
    });

    const hasMore = posts.length > (limit || 20);
    const items = hasMore ? posts.slice(0, -1) : posts;

    // Add stats to each post
    const itemsWithStats = items.map((post) => {
      const fundedGLM = post.pledges.reduce((sum, p) => sum + p.amountGLM, 0);
      const donors = new Set(post.pledges.filter((p) => p.type === 'donation').map((p) => p.pledgerId)).size;
      const sponsors = new Set(post.pledges.filter((p) => p.type === 'contract').map((p) => p.pledgerId)).size;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { pledges, owner, ...postData } = post;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, auth0_sub, ...ownerPublic } = owner;

      return {
        ...postData,
        owner: {
          ...ownerPublic,
          sponsor: owner.sponsor ? {
            verified: owner.sponsor.verified,
            rating: owner.sponsor.rating,
          } : null,
        },
        stats: { fundedGLM, donors, sponsors },
      };
    });

    return NextResponse.json({
      items: itemsWithStats,
      nextCursor: hasMore ? items[items.length - 1]?.id : null,
    });
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch posts' } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    const data = await validateBody(req, createPostSchema);

    const post = await db.post.create({
      data: {
        ...data,
        ownerId: user.id,
      },
      include: {
        owner: {
          include: {
            sponsor: true,
          },
        },
      },
    });

    // Create post account for receiving pledges
    await getOrCreateAccount('post', post.id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, auth0_sub, ...ownerPublic } = post.owner;

    return NextResponse.json(
      {
        ...post,
        owner: {
          ...ownerPublic,
          sponsor: post.owner.sponsor ? {
            verified: post.owner.sponsor.verified,
            rating: post.owner.sponsor.rating,
          } : null,
        },
        stats: { fundedGLM: 0, donors: 0, sponsors: 0 },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('POST /api/posts error:', error);

    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Invalid post data' } },
      { status: 400 }
    );
  }
}

