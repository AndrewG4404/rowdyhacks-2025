// Test Zod validation
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { z } from 'zod';

const testSchema = z.object({
  amountGLM: z.number().int().min(1).max(10000),
  note: z.string().optional().default('Test'),
});

export async function POST(req: NextRequest) {
  try {
    console.log('Test Zod validation endpoint called');
    const user = await authenticateRequest(req);
    console.log('User authenticated:', user.id);
    
    // Parse request body manually
    const body = await req.json();
    console.log('Parsed body:', body);
    
    const data = testSchema.parse(body);
    console.log('Data validated:', data);
    
    return NextResponse.json({
      success: true,
      data,
      message: 'Zod validation working'
    });
  } catch (error) {
    console.error('Test Zod validation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Zod validation failed'
    }, { status: 400 });
  }
}
