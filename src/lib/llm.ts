// GoLoanMe - OpenRouter LLM Integration
// Generate contract templates using Google Gemini with fallback

import type { TermsInputs, LLMGenerateResponse } from '@/types';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Model configuration
const PRIMARY_MODEL = 'google/gemini-2.0-flash-exp:free';
const FALLBACK_MODEL = 'meta-llama/llama-3.2-3b-instruct:free';

const SYSTEM_PROMPT = `You are a contract template drafter for community micro-funding platforms.

Your task is to generate clear, plain-language contract templates based on user inputs.

CRITICAL RULES:
- Output ONLY valid JSON with "html" and "schema" fields
- Use plain language, accessible to non-lawyers
- Include disclaimer that this is not legally binding
- This is for SIMULATED currency (GLM credits) - educational use only

OUTPUT FORMAT (JSON only, no markdown):
{
  "schema": {
    "title": "...",
    "parties": "Sponsor and Recipient",
    "amount": "...",
    "interestPercent": ...,
    "cadence": "...",
    "graceDays": ...,
    "collateral": "...",
    "remedies": "...",
    "disclaimers": "..."
  },
  "html": "<div class='contract'><h1>...</h1><section>...</section></div>"
}`;

/**
 * Generate contract template using LLM
 */
export async function generateContract(
  inputs: TermsInputs,
  preferredModel?: string
): Promise<LLMGenerateResponse> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  const model = preferredModel || PRIMARY_MODEL;

  try {
    console.log(`📝 Generating contract with ${model}...`);
    
    const response = await callOpenRouter(model, inputs);
    return response;
  } catch (error: unknown) {
    console.error(`❌ ${model} failed:`, error);

    // Retry with fallback model if primary fails
    if (model === PRIMARY_MODEL) {
      console.log(`🔄 Retrying with fallback model: ${FALLBACK_MODEL}`);
      return callOpenRouter(FALLBACK_MODEL, inputs);
    }

    throw error;
  }
}

/**
 * Call OpenRouter API
 */
async function callOpenRouter(
  model: string,
  inputs: TermsInputs
): Promise<LLMGenerateResponse> {
  const userPrompt = buildUserPrompt(inputs);

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      'X-Title': 'GoLoanMe',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenRouter error:', errorText);
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded');
    }
    
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No content in LLM response');
  }

  // Parse JSON response
  const parsed = parseContractResponse(content);

  return {
    html: parsed.html,
    json: inputs,
    model,
  };
}

/**
 * Build user prompt from inputs
 */
function buildUserPrompt(inputs: TermsInputs): string {
  return `Generate a contract template with these terms:

Title: ${inputs.title}
Interest Rate: ${inputs.interestPercent || 0}% annually
Repayment Cadence: ${inputs.cadence || 'monthly'}
Grace Period: ${inputs.graceDays || 0} days
Collateral: ${inputs.collateralText || 'None specified'}
Remedies: ${inputs.remedies || 'Pause contributions; mediation; repayment plan adjustment'}
Disclaimers: ${inputs.disclaimers || 'Non-legal template for educational use only. Not enforceable. Simulated currency.'}
Locality: ${inputs.locality || 'General'}

Generate a plain-language contract with sections:
1. Parties
2. Offer & Consideration
3. Amount & Interest
4. Repayment Schedule
5. Grace Period
6. Collateral (if any)
7. Remedies for Non-Payment
8. Legal Disclaimers

Output ONLY valid JSON.`;
}

/**
 * Parse and validate LLM response
 */
function parseContractResponse(content: string): { html: string; schema: Record<string, unknown> } {
  // Remove markdown code blocks if present
  let cleaned = content.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }

  try {
    const parsed = JSON.parse(cleaned);

    if (!parsed.html || typeof parsed.html !== 'string') {
      throw new Error('Missing or invalid "html" field');
    }

    return {
      html: parsed.html,
      schema: parsed.schema || {},
    };
  } catch (error) {
    console.error('Failed to parse LLM response:', error);
    console.error('Raw content:', content);
    throw new Error('Invalid JSON response from LLM');
  }
}

/**
 * Cache for last successful generation per user
 */
const generationCache = new Map<string, LLMGenerateResponse>();

export function cacheGeneration(userId: string, response: LLMGenerateResponse): void {
  generationCache.set(userId, response);
}

export function getCachedGeneration(userId: string): LLMGenerateResponse | undefined {
  return generationCache.get(userId);
}

