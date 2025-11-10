#!/usr/bin/env node

/**
 * Environment Variables Checker
 *
 * Quick diagnostic tool to verify all required environment variables are set.
 *
 * Usage:
 *   node scripts/check-env.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'cyan');
}

function logSection(message) {
  log(`\n${'='.repeat(60)}`, 'blue');
  log(message, 'bright');
  log('='.repeat(60), 'blue');
}

function maskSecret(value, showChars = 8) {
  if (!value) return 'NOT SET';
  if (value.length <= showChars) return '*'.repeat(value.length);
  return value.substring(0, showChars) + '...' + '*'.repeat(Math.min(20, value.length - showChars));
}

function checkEnv() {
  logSection('Environment Variables Check');

  const checks = {
    required: {
      SUPABASE_URL: {
        value: process.env.SUPABASE_URL,
        validator: (v) => v && v.startsWith('https://'),
        error: 'Should start with https://',
        hint: 'Get from Supabase Dashboard → Settings → API → Project URL',
      },
      SUPABASE_SERVICE_ROLE_KEY: {
        value: process.env.SUPABASE_SERVICE_ROLE_KEY,
        validator: (v) => v && v.startsWith('ey') && v.split('.').length >= 3,
        error: 'Should be a JWT token (starts with "ey")',
        hint: 'Get from Supabase Dashboard → Settings → API → service_role key',
      },
      ADMIN_SESSION_SECRET: {
        value: process.env.ADMIN_SESSION_SECRET,
        validator: (v) => v && v.length >= 32,
        error: 'Should be at least 32 characters',
        hint: 'Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
      },
    },
    optional: {
      SUPABASE_KEY: {
        value: process.env.SUPABASE_KEY,
        validator: (v) => !v || (v.startsWith('ey') && v.split('.').length >= 3),
        error: 'Should be a JWT token if set',
        hint: 'Get from Supabase Dashboard → Settings → API → anon/public key',
      },
      NEXT_PUBLIC_SUPABASE_URL: {
        value: process.env.NEXT_PUBLIC_SUPABASE_URL,
        validator: (v) => !v || v.startsWith('https://'),
        error: 'Should start with https:// if set',
        hint: 'Should match SUPABASE_URL',
      },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: {
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        validator: (v) => !v || (v.startsWith('ey') && v.split('.').length >= 3),
        error: 'Should be a JWT token if set',
        hint: 'Should match SUPABASE_KEY',
      },
    },
  };

  let hasErrors = false;
  let hasWarnings = false;

  // Check required variables
  log('\n📋 Required Variables:', 'bright');
  for (const [key, config] of Object.entries(checks.required)) {
    const value = config.value;
    const isValid = config.validator(value);

    if (!value) {
      logError(`${key}: NOT SET`);
      logInfo(`   ${config.hint}`);
      hasErrors = true;
    } else if (!isValid) {
      logError(`${key}: ${config.error}`);
      logInfo(`   Current: ${maskSecret(value)}`);
      logInfo(`   ${config.hint}`);
      hasErrors = true;
    } else {
      logSuccess(`${key}: ${maskSecret(value)}`);
    }
  }

  // Check optional variables
  log('\n📋 Optional Variables:', 'bright');
  for (const [key, config] of Object.entries(checks.optional)) {
    const value = config.value;
    const isValid = config.validator(value);

    if (!value) {
      logWarning(`${key}: NOT SET`);
      logInfo(`   ${config.hint}`);
      hasWarnings = true;
    } else if (!isValid) {
      logWarning(`${key}: ${config.error}`);
      logInfo(`   Current: ${maskSecret(value)}`);
      logInfo(`   ${config.hint}`);
      hasWarnings = true;
    } else {
      logSuccess(`${key}: ${maskSecret(value)}`);
    }
  }

  // Summary
  logSection('Summary');

  if (hasErrors) {
    logError('❌ Environment check FAILED');
    logInfo('\nRequired variables are missing or invalid.');
    logInfo('Create or update .env.local in the project root.');
    logInfo('\nExample .env.local:');
    console.log(`
${colors.yellow}SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
ADMIN_SESSION_SECRET=your-random-secret-at-least-32-chars

# Optional
SUPABASE_KEY=eyJhbGc...your-anon-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key${colors.reset}
`);
    return false;
  }

  if (hasWarnings) {
    logWarning('⚠ Environment check PASSED with warnings');
    logInfo('\nOptional variables are not set. This may affect client-side functionality.');
  } else {
    logSuccess('✅ Environment check PASSED');
    logInfo('\nAll variables are properly configured!');
  }

  logInfo('\nNext steps:');
  console.log('  1. Run database migrations (see README.md)');
  console.log('  2. Create admin user: npm run setup:admin');
  console.log('  3. Verify setup: npm run verify:admin');
  console.log('  4. Start dev server: npm run dev');

  return true;
}

// Run check
const success = checkEnv();
process.exit(success ? 0 : 1);

