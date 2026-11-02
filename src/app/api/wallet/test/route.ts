// GET /api/wallet/test - Simple test endpoint
// Protected endpoint

import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { validateBody } from '@/lib/validations';
import { z } from 'zod';

const testSchema = z.object({
  amountGLM: z.number().int().min(1).max(10000),
  note: z.string().optional().default('Test'),
});

export async function GET(req: NextRequest) {
  try {
    console.log('Test endpoint called');
    const user = await authenticateRequest(req);
    console.log('User authenticated:', user.id);
    
    return NextResponse.json({
      success: true,
      userId: user.id,
      message: 'Test endpoint working'
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    
    return NextResponse.json(
      { error: { code: 'ERROR', message: error instanceof Error ? error.message : 'Unknown error' } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('Test POST endpoint called');
    const user = await authenticateRequest(req);
    console.log('User authenticated:', user.id);
    
    const data = await validateBody(req, testSchema);
    console.log('Data validated:', data);
    
    return NextResponse.json({
      success: true,
      userId: user.id,
      data: data,
      message: 'Test POST endpoint working'
    });
  } catch (error) {
    console.error('Test POST endpoint error:', error);
    
    return NextResponse.json(
      { error: { code: 'ERROR', message: error instanceof Error ? error.message : 'Unknown error' } },
      { status: 500 }
    );
  }
}
