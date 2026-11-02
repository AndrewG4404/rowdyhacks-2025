// POST /api/terms/summary - Generate user-friendly summary of terms
// Protected endpoint

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { validateBody, termsInputsSchema } from '@/lib/validations';
import { generateContract } from '@/lib/llm';

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    const inputs = await validateBody(req, termsInputsSchema);

    // Generate contract via LLM (this includes the summary)
    console.log('🤖 Generating terms summary for user:', user.handle);
    const llmResponse = await generateContract(inputs);

    // Return only the summary for quick preview
    return NextResponse.json({
      summary: llmResponse.summary,
      title: inputs.title,
      model: llmResponse.model,
    }, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error: unknown) {
    console.error('POST /api/terms/summary error:', error);

    if (error instanceof Error) {
      if (error.message.includes('Authentication required')) {
        return NextResponse.json(
          { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
          { status: 401 }
        );
      }

      if (error.message.includes('Rate limit')) {
        return NextResponse.json(
          { error: { code: 'RATE_LIMIT', message: 'LLM rate limit exceeded. Please try again later.' } },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: { code: 'LLM_ERROR', message: error.message } },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to generate summary' } },
      { status: 500 }
    );
  }
}
