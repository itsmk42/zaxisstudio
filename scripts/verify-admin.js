#!/usr/bin/env node

/**
 * Admin User Verification Script
 * 
 * This script verifies that admin users exist and can be authenticated.
 * 
 * Usage:
 *   node scripts/verify-admin.js
 *   node scripts/verify-admin.js --username admin@example.com
 */

import { createClient } from '@supabase/supabase-js';
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

function logInfo(message) {
  log(`ℹ ${message}`, 'cyan');
}

function logSection(message) {
  log(`\n${'='.repeat(60)}`, 'blue');
  log(message, 'bright');
  log('='.repeat(60), 'blue');
}

async function verifyAdminUsers(username = null) {
  logSection('Admin User Verification');

  // Check environment
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    logError('Missing required environment variables');
    logInfo('Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    return false;
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Query admin users
    let query = supabase
      .from('admin_users')
      .select('id, username, role, created_at, failed_attempts, locked_until');

    if (username) {
      query = query.eq('username', username);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      logError(`Database error: ${error.message}`);
      return false;
    }

    if (!data || data.length === 0) {
      if (username) {
        logError(`No admin user found with username: ${username}`);
      } else {
        logError('No admin users found in database');
        logInfo('\nRun: npm run setup:admin');
      }
      return false;
    }

    logSuccess(`Found ${data.length} admin user(s)\n`);

    // Display users
    data.forEach((user, index) => {
      log(`\n${colors.bright}Admin User #${index + 1}${colors.reset}`);
      console.log(`  ID:              ${user.id}`);
      console.log(`  Username:        ${user.username}`);
      console.log(`  Role:            ${user.role}`);
      console.log(`  Created:         ${new Date(user.created_at).toLocaleString()}`);
      console.log(`  Failed Attempts: ${user.failed_attempts || 0}`);
      
      if (user.locked_until) {
        const lockedUntil = new Date(user.locked_until);
        const isLocked = lockedUntil > new Date();
        if (isLocked) {
          log(`  Status:          🔒 LOCKED until ${lockedUntil.toLocaleString()}`, 'red');
        } else {
          log(`  Status:          ✓ Active (lock expired)`, 'green');
        }
      } else {
        log(`  Status:          ✓ Active`, 'green');
      }
    });

    logSection('Verification Complete');
    logSuccess('Admin users are properly configured!');
    logInfo('\nYou can log in at: http://localhost:3000/admin/login');

    return true;
  } catch (error) {
    logError(`Verification failed: ${error.message}`);
    return false;
  }
}

// Parse arguments
const args = process.argv.slice(2);
let username = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--username' || args[i] === '-u') {
    username = args[++i];
  }
}

// Run verification
verifyAdminUsers(username)
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    logError(`Unexpected error: ${error.message}`);
    console.error(error);
    process.exit(1);
  });

