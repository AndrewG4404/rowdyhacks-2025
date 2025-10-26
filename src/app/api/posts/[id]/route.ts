// GET /api/posts/{id} - Get post detail (public)
// PATCH /api/posts/{id} - Update post (owner only)
// DELETE /api/posts/{id} - Delete post (owner or admin)

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { validateBody } from '@/lib/validations';
import { z } from 'zod';

const updatePostSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  description: z.string().min(20).max(5000).optional(),
  category: z.enum(['medical', 'funeral', 'fun', 'vet', 'education', 'community', 'other']).optional(),
  images: z.array(z.string().url()).max(5).optional(),
  links: z.array(z.string().url()).max(10).optional(),
  acceptContracts: z.boolean().optional(),
  status: z.enum(['open', 'closed']).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const post = await db.post.findUnique({
      where: { id },
      include: {
        owner: {
          include: {
            sponsor: true,
          },
        },
        pledges: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Post not found' } },
        { status: 404 }
      );
    }

    // Calculate stats
    const fundedGLM = post.pledges.reduce((sum, p) => sum + p.amountGLM, 0);
    const donors = new Set(post.pledges.filter((p) => p.type === 'donation').map((p) => p.pledgerId)).size;
    const sponsors = new Set(post.pledges.filter((p) => p.type === 'contract').map((p) => p.pledgerId)).size;

    // Omit private user fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pledges, owner, ...postData } = post;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, auth0_sub, ...ownerPublic } = owner;

    const response = {
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

    const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

    return NextResponse.json(response, {
      headers: {
        'X-Request-Id': requestId,
      },
    });
  } catch (error) {
    console.error('GET /api/posts/[id] error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch post' } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(req);
    const { id } = params;
    const data = await validateBody(req, updatePostSchema);

    // Check if post exists
    const existingPost = await db.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Post not found' } },
        { status: 404 }
      );
    }

    // Check ownership
    if (existingPost.ownerId !== user.id) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'You do not own this post' } },
        { status: 403 }
      );
    }

    // Update post
    const updated = await db.post.update({
      where: { id },
      data,
      include: {
        owner: {
          include: {
            sponsor: true,
          },
        },
        pledges: true,
      },
    });

    // Calculate stats
    const fundedGLM = updated.pledges.reduce((sum, p) => sum + p.amountGLM, 0);
    const donors = new Set(updated.pledges.filter((p) => p.type === 'donation').map((p) => p.pledgerId)).size;
    const sponsors = new Set(updated.pledges.filter((p) => p.type === 'contract').map((p) => p.pledgerId)).size;

    // Format response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pledges, owner, ...postData } = updated;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, auth0_sub, ...ownerPublic } = owner;

    const response = {
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

    const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

    console.log(`✅ Post updated: ${id} by ${user.handle}`);

    return NextResponse.json(response, {
      headers: {
        'X-Request-Id': requestId,
      },
    });
  } catch (error: unknown) {
    console.error('PATCH /api/posts/[id] error:', error);

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(req);
    const { id } = params;

    // Check if post exists
    const existingPost = await db.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Post not found' } },
        { status: 404 }
      );
    }

    // Check ownership (or admin - TODO: add isAdmin check)
    if (existingPost.ownerId !== user.id) {
      // TODO: Check if user is admin
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'You do not own this post' } },
        { status: 403 }
      );
    }

    // Delete post (cascade will delete related pledges, comments, etc.)
    await db.post.delete({
      where: { id },
    });

    console.log(`✅ Post deleted: ${id} by ${user.handle}`);

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error('DELETE /api/posts/[id] error:', error);

    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to delete post' } },
      { status: 500 }
    );
  }
}

