// GET /api/terms/{id}/download - Download terms template as PDF
// Protected endpoint

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { generatePDF } from '@/lib/pdf';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(req);
    const { id } = params;

    const termsTemplate = await db.termsTemplate.findUnique({
      where: { id },
    });

    if (!termsTemplate) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Terms template not found' } },
        { status: 404 }
      );
    }

    // Only owner can download their own terms
    if (termsTemplate.userId !== user.id) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'You do not own this terms template' } },
        { status: 403 }
      );
    }

    // Generate PDF from HTML
    const pdfBuffer = await generatePDF(termsTemplate.html);

    // Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${termsTemplate.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('GET /api/terms/[id]/download error:', error);

    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to generate PDF' } },
      { status: 500 }
    );
  }
}
