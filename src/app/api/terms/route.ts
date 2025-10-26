// POST /api/terms - Generate contract terms template via LLM
// Protected endpoint

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { validateBody, termsInputsSchema } from '@/lib/validations';
import { generateContract } from '@/lib/llm';
import { generatePDF } from '@/lib/pdf';
import { uploadPDF } from '@/lib/storage';

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Idempotency-Key',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    const inputs = await validateBody(req, termsInputsSchema);

    // Generate contract via LLM
    console.log('🤖 Generating contract for user:', user.handle);
    const llmResponse = await generateContract(inputs);

    // Generate PDF from HTML
    console.log('📄 Generating PDF...');
    const pdfBuffer = await generatePDF(llmResponse.html);

    // Upload PDF to Cloudinary
    console.log('☁️ Uploading to Cloudinary...');
    const filename = `terms_${user.id}_${Date.now()}`;
    const pdfUrl = await uploadPDF(pdfBuffer, filename);

    // Save to database
    const termsTemplate = await db.termsTemplate.create({
      data: {
        userId: user.id,
        title: inputs.title,
        inputs: inputs as any, // JSON field
        llmVersion: llmResponse.model,
        html: llmResponse.html,
        pdfUrl,
      },
    });

    console.log('✅ Terms template created:', termsTemplate.id);

    return NextResponse.json(termsTemplate, { 
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error: unknown) {
    console.error('POST /api/terms error:', error);

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
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to generate terms' } },
      { status: 500 }
    );
  }
}

