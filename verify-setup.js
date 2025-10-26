#!/usr/bin/env node
// GoLoanMe - Setup Verification Script
// Run: node verify-setup.js

console.log('🔍 Verifying GoLoanMe Setup...\n');

// Check environment variables
const requiredEnvVars = [
  'AUTH0_DOMAIN',
  'AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET',
  'AUTH0_AUDIENCE',
  'OPENROUTER_API_KEY',
  'DATABASE_URL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'NEXT_PUBLIC_BASE_URL',
];

let allSet = true;
let exposedCredentials = [];

console.log('📋 Environment Variables:');
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName} is set`);
    
    // Check for exposed credentials
    if (varName === 'OPENROUTER_API_KEY' && value.includes('f583f8648bf7499db14241048332ab31')) {
      exposedCredentials.push('OpenRouter API Key');
    }
    if (varName === 'DATABASE_URL' && value.includes('GlqodeTsag6kwBaj')) {
      exposedCredentials.push('MongoDB Password');
    }
    if (varName === 'CLOUDINARY_API_SECRET' && value.includes('0bIivE6blcwX4-MuSMjtEwxRLUs')) {
      exposedCredentials.push('Cloudinary Secret');
    }
  } else {
    console.log(`  ❌ ${varName} is NOT set`);
    allSet = false;
  }
});

console.log('\n📦 Dependencies:');
try {
  require('@prisma/client');
  console.log('  ✅ @prisma/client installed');
} catch {
  console.log('  ❌ @prisma/client NOT installed');
  allSet = false;
}

try {
  require('next');
  console.log('  ✅ next installed');
} catch {
  console.log('  ❌ next NOT installed');
  allSet = false;
}

console.log('\n🚨 Security Check:');
if (exposedCredentials.length > 0) {
  console.log('  ⚠️  WARNING: EXPOSED CREDENTIALS DETECTED!');
  console.log('  You are still using credentials that were exposed in Git:');
  exposedCredentials.forEach(cred => {
    console.log(`    - ${cred}`);
  });
  console.log('\n  🔄 Please rotate these credentials IMMEDIATELY:');
  console.log('    1. OpenRouter: https://openrouter.ai/keys');
  console.log('    2. MongoDB: https://cloud.mongodb.com/');
  console.log('    3. Cloudinary: https://console.cloudinary.com/settings/security');
  allSet = false;
} else {
  console.log('  ✅ No exposed credentials detected');
}

console.log('\n' + '='.repeat(60));
if (allSet && exposedCredentials.length === 0) {
  console.log('✅ Setup is complete and secure!');
  console.log('\nNext steps:');
  console.log('  1. npm run prisma:migrate');
  console.log('  2. npm run prisma:seed');
  console.log('  3. npm run dev');
} else {
  console.log('⚠️  Setup is incomplete or insecure!');
  console.log('\nPlease fix the issues above before proceeding.');
}
console.log('='.repeat(60) + '\n');

process.exit(allSet && exposedCredentials.length === 0 ? 0 : 1);

