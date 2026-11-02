// POST /api/ai/contracts/generate - Internal LLM contract generation
// Server-only endpoint (not exposed to browsers)

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, isAdmin } from '@/lib/auth';
import { validateBody, termsInputsSchema } from '@/lib/validations';
import { generateContract } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    // Authenticate and check admin role (server-only)
    const user = await authenticateRequest(req);
    const userIsAdmin = await isAdmin(user.id);
    
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Admin or server token required' } },
        { status: 403 }
      );
    }

    // Validate input
    const inputs = await validateBody(req, termsInputsSchema);

    // Generate contract via LLM (OpenRouter + Gemini)
    console.log('🤖 AI endpoint: Generating contract...');
    const llmResponse = await generateContract(inputs);

    const requestId = req.headers.get('x-request-id') || crypto.randomUUID();

    // Return LLM output (HTML + JSON + model used)
    return NextResponse.json({
      html: llmResponse.html,
      json: inputs,
      model: llmResponse.model,
    }, {
      headers: {
        'X-Request-Id': requestId,
      },
    });
  } catch (error: unknown) {
    console.error('POST /api/ai/contracts/generate error:', error);

    if (error instanceof Error) {
      if (error.message.includes('Authentication required')) {
        return NextResponse.json(
          { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
          { status: 401 }
        );
      }

      if (error.message.includes('Rate limit')) {
        const retryAfter = 60; // 1 minute
        return NextResponse.json(
          { error: { code: 'RATE_LIMIT', message: 'LLM rate limit exceeded. Please retry later.' } },
          { 
            status: 429,
            headers: {
              'Retry-After': retryAfter.toString(),
            },
          }
        );
      }

      return NextResponse.json(
        { error: { code: 'LLM_ERROR', message: error.message } },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to generate contract' } },
      { status: 500 }
    );
  }
}

