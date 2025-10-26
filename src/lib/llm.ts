// GoLoanMe - OpenRouter LLM Integration
// Generate contract templates using Google Gemini with fallback

import type { TermsInputs, LLMGenerateResponse } from '@/types';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Model configuration
const PRIMARY_MODEL = 'google/gemini-2.0-flash-exp:free';
const FALLBACK_MODEL = 'meta-llama/llama-3.2-3b-instruct:free';
const DEMO_MODEL = 'demo-template';

const SYSTEM_PROMPT = `You are an expert contract attorney specializing in community micro-funding agreements. Your task is to generate professional, legally-structured contract templates based on user inputs.

CRITICAL REQUIREMENTS:
- Output ONLY valid JSON with "html" and "schema" fields
- Use formal legal language and structure
- Include comprehensive legal sections and clauses
- Ensure professional formatting and terminology
- Include all necessary legal disclaimers and boilerplate
- This is for SIMULATED currency (GLM credits) - educational use only

CONTRACT STRUCTURE REQUIREMENTS:
1. Header with contract title and parties
2. Recitals section explaining the purpose
3. Definitions section for key terms
4. Principal terms (amount, interest, repayment schedule)
5. Collateral and security provisions
6. Default and remedies section
7. Governing law and jurisdiction
8. Legal disclaimers and limitations
9. Execution and signature blocks

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
    "disclaimers": "...",
    "governingLaw": "...",
    "jurisdiction": "..."
  },
  "html": "<div class='legal-contract'><header>...</header><section class='recitals'>...</section><section class='definitions'>...</section><section class='principal-terms'>...</section><section class='collateral'>...</section><section class='default-remedies'>...</section><section class='governing-law'>...</section><section class='disclaimers'>...</section><section class='execution'>...</section></div>"
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
      try {
        return await callOpenRouter(FALLBACK_MODEL, inputs);
      } catch (fallbackError) {
        console.error(`❌ ${FALLBACK_MODEL} also failed:`, fallbackError);
        console.log(`🔄 Using demo template due to rate limits`);
        return generateDemoTemplate(inputs);
      }
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
  return `Generate a professional legal contract with these terms:

CONTRACT DETAILS:
Title: ${inputs.title}
Principal Amount: As specified in the pledge (GLM Credits - simulated currency)
Interest Rate: ${inputs.interestPercent || 0}% annually
Repayment Frequency: ${inputs.cadence || 'monthly'}
Grace Period: ${inputs.graceDays || 0} days
Collateral: ${inputs.collateralText || 'None specified'}
Remedies for Default: ${inputs.remedies || 'Pause contributions; mediation; repayment plan adjustment'}
Legal Disclaimers: ${inputs.disclaimers || 'Non-legal template for educational use only. Not enforceable. Simulated currency.'}
Governing Law: ${inputs.locality || 'General jurisdiction'}

REQUIRED CONTRACT SECTIONS:
1. CONTRACT HEADER: Formal title, date, and party identification
2. RECITALS: Purpose and background of the funding arrangement
3. DEFINITIONS: Key terms (GLM Credits, Sponsor, Recipient, Default, etc.)
4. PRINCIPAL TERMS: Amount, interest rate, repayment schedule, grace period
5. COLLATERAL PROVISIONS: Security arrangements and collateral description
6. DEFAULT AND REMEDIES: What constitutes default and available remedies
7. GOVERNING LAW: Jurisdiction and applicable law
8. LEGAL DISCLAIMERS: Educational use, non-enforceability, simulated currency
9. EXECUTION: Signature blocks for both parties

STYLE REQUIREMENTS:
- Use formal legal language and terminology
- Include proper legal formatting and structure
- Add comprehensive boilerplate clauses
- Ensure professional appearance
- Include all necessary legal protections

Generate a complete, professional legal contract template. Output ONLY valid JSON.`;
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

/**
 * Generate demo template when LLM is unavailable
 */
function generateDemoTemplate(inputs: TermsInputs): LLMGenerateResponse {
  const html = `
<div class="contract">
  <h1>${inputs.title}</h1>
  
  <section>
    <h2>Parties</h2>
    <p>This agreement is between the Sponsor and the Recipient for community micro-funding purposes.</p>
  </section>
  
  <section>
    <h2>Offer & Consideration</h2>
    <p>The Sponsor agrees to provide GLM credits to the Recipient for the stated purpose. The Recipient agrees to use the funds as described and repay according to the terms below.</p>
  </section>
  
  <section>
    <h2>Amount & Interest</h2>
    <p>Principal Amount: As specified in the pledge<br>
    Interest Rate: ${inputs.interestPercent || 0}% annually<br>
    Currency: GLM Credits (simulated)</p>
  </section>
  
  <section>
    <h2>Repayment Schedule</h2>
    <p>Repayment Frequency: ${inputs.cadence || 'monthly'}<br>
    Grace Period: ${inputs.graceDays || 0} days</p>
  </section>
  
  ${inputs.collateralText ? `
  <section>
    <h2>Collateral</h2>
    <p>${inputs.collateralText}</p>
  </section>
  ` : ''}
  
  <section>
    <h2>Remedies for Non-Payment</h2>
    <p>${inputs.remedies || 'If repayment is not made on time: 1) Pause further contributions, 2) Attempt mediation, 3) Adjust repayment plan as needed.'}</p>
  </section>
  
  <section>
    <h2>Legal Disclaimers</h2>
    <p>${inputs.disclaimers || 'This is a non-legal template for educational use only. This agreement is not legally enforceable. GLM credits are simulated currency for demonstration purposes only.'}</p>
  </section>
  
  <section>
    <h2>Locality</h2>
    <p>${inputs.locality || 'General jurisdiction'}</p>
  </section>
</div>`;

  return {
    html,
    json: inputs,
    model: DEMO_MODEL,
  };
}

