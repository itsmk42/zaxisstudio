#!/usr/bin/env node

/**
 * Admin User Setup Script for Zaxis Studio
 * 
 * This script automates the creation of admin users with:
 * - Environment variable validation
 * - Database table verification
 * - Secure password validation
 * - Bcrypt password hashing
 * - Interactive prompts or command-line arguments
 * 
 * Usage:
 *   node scripts/setup-admin.js
 *   node scripts/setup-admin.js --username admin@example.com --password "SecurePass123!"
 *   node scripts/setup-admin.js --check-only
 */

import readline from 'readline';
import bcrypt from 'bcryptjs';
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

// ANSI color codes for terminal output
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

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    username: null,
    password: null,
    role: 'admin',
    checkOnly: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--username':
      case '-u':
        parsed.username = args[++i];
        break;
      case '--password':
      case '-p':
        parsed.password = args[++i];
        break;
      case '--role':
      case '-r':
        parsed.role = args[++i];
        break;
      case '--check-only':
      case '-c':
        parsed.checkOnly = true;
        break;
      case '--help':
      case '-h':
        parsed.help = true;
        break;
    }
  }

  return parsed;
}

function showHelp() {
  console.log(`
${colors.bright}Zaxis Studio - Admin User Setup Script${colors.reset}

${colors.cyan}Usage:${colors.reset}
  node scripts/setup-admin.js [options]

${colors.cyan}Options:${colors.reset}
  -u, --username <email>    Admin username/email
  -p, --password <pass>     Admin password (min 12 chars, mixed case, number, special char)
  -r, --role <role>         Admin role (default: admin)
  -c, --check-only          Only check environment and database, don't create user
  -h, --help                Show this help message

${colors.cyan}Examples:${colors.reset}
  ${colors.yellow}# Interactive mode (prompts for input)${colors.reset}
  node scripts/setup-admin.js

  ${colors.yellow}# With command-line arguments${colors.reset}
  node scripts/setup-admin.js --username admin@example.com --password "SecurePass123!"

  ${colors.yellow}# Check environment only${colors.reset}
  node scripts/setup-admin.js --check-only

${colors.cyan}Password Requirements:${colors.reset}
  • Minimum 12 characters
  • At least 1 uppercase letter (A-Z)
  • At least 1 lowercase letter (a-z)
  • At least 1 number (0-9)
  • At least 1 special character (!@#$%^&*, etc.)
`);
}

// Validate environment variables
function validateEnvironment() {
  logSection('Step 1: Validating Environment Variables');

  const required = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
  };

  const optional = {
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  let hasErrors = false;

  // Check required variables
  for (const [key, value] of Object.entries(required)) {
    if (!value) {
      logError(`Missing required environment variable: ${key}`);
      hasErrors = true;
    } else {
      logSuccess(`${key} is set`);
    }
  }

  // Check optional variables
  for (const [key, value] of Object.entries(optional)) {
    if (!value) {
      logWarning(`Optional environment variable not set: ${key}`);
    } else {
      logSuccess(`${key} is set`);
    }
  }

  // Validate formats
  if (required.SUPABASE_URL && !required.SUPABASE_URL.startsWith('https://')) {
    logError('SUPABASE_URL should start with https://');
    hasErrors = true;
  }

  if (required.SUPABASE_SERVICE_ROLE_KEY && !required.SUPABASE_SERVICE_ROLE_KEY.startsWith('ey')) {
    logError('SUPABASE_SERVICE_ROLE_KEY should be a JWT token (starts with "ey")');
    hasErrors = true;
  }

  if (required.ADMIN_SESSION_SECRET && required.ADMIN_SESSION_SECRET.length < 32) {
    logWarning('ADMIN_SESSION_SECRET should be at least 32 characters for security');
  }

  if (hasErrors) {
    logError('\nEnvironment validation failed. Please check your .env.local file.');
    return false;
  }

  logSuccess('\nAll required environment variables are properly configured!');
  return true;
}

// Check database tables
async function checkDatabaseTables(supabase) {
  logSection('Step 2: Verifying Database Tables');

  try {
    // Check if admin_users table exists by attempting a query
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .limit(1);

    if (error) {
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        logError('Table "admin_users" does not exist');
        logInfo('\nPlease run the following SQL in Supabase SQL Editor:');
        console.log(`
${colors.yellow}-- Create admin_users table
create table if not exists public.admin_users (
  id bigserial primary key,
  username text unique not null,
  password_hash text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create index if not exists admin_users_username_idx on public.admin_users (username);

-- Add lockout protection
alter table if exists public.admin_users
  add column if not exists failed_attempts integer not null default 0,
  add column if not exists locked_until timestamptz,
  add column if not exists last_failed_at timestamptz;

alter table if exists public.admin_users enable row level security;
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'admin_users' and policyname = 'deny all admin_users'
  ) then
    execute 'create policy "deny all admin_users" on public.admin_users for all using (false) with check (false)';
  end if;
end $$;${colors.reset}
`);
        return false;
      }
      throw error;
    }

    logSuccess('Table "admin_users" exists');

    // Check for lockout columns
    const { data: users, error: selectError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1);

    if (!selectError && users && users.length > 0) {
      const user = users[0];
      const hasLockout = 'failed_attempts' in user && 'locked_until' in user;
      if (hasLockout) {
        logSuccess('Lockout protection columns exist');
      } else {
        logWarning('Lockout protection columns missing (failed_attempts, locked_until)');
        logInfo('Run db/admin_users_lockout.sql to add them');
      }
    } else {
      logInfo('Table is empty, cannot verify lockout columns');
    }

    logSuccess('\nDatabase tables are properly configured!');
    return true;
  } catch (error) {
    logError(`Database check failed: ${error.message}`);
    return false;
  }
}

// Validate password
function validatePassword(password) {
  const minLen = 12;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const errors = [];
  if (!password || password.length < minLen) {
    errors.push(`Password must be at least ${minLen} characters`);
  }
  if (!hasUpper) errors.push('Password must include an uppercase letter');
  if (!hasLower) errors.push('Password must include a lowercase letter');
  if (!hasNumber) errors.push('Password must include a number');
  if (!hasSpecial) errors.push('Password must include a special character');

  return { valid: errors.length === 0, errors };
}

// Prompt for user input
function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Create admin user
async function createAdminUser(supabase, username, password, role = 'admin') {
  logSection('Step 3: Creating Admin User');

  try {
    // Hash password
    logInfo('Hashing password...');
    const passwordHash = await bcrypt.hash(password, 12);
    logSuccess('Password hashed successfully');

    // Insert user
    logInfo(`Creating user: ${username}`);
    const { data, error } = await supabase
      .from('admin_users')
      .upsert(
        {
          username,
          password_hash: passwordHash,
          role,
          failed_attempts: 0,
          locked_until: null,
        },
        { onConflict: 'username' }
      )
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    logSuccess(`\nAdmin user created successfully!`);
    logInfo(`\nUser Details:`);
    console.log(`  ID:       ${data.id}`);
    console.log(`  Username: ${data.username}`);
    console.log(`  Role:     ${data.role}`);
    console.log(`  Created:  ${data.created_at}`);

    return true;
  } catch (error) {
    logError(`Failed to create admin user: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  const args = parseArgs();

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  log(`\n${colors.bright}${colors.blue}Zaxis Studio - Admin User Setup${colors.reset}\n`);

  // Step 1: Validate environment
  if (!validateEnvironment()) {
    process.exit(1);
  }

  // Initialize Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Step 2: Check database
  if (!(await checkDatabaseTables(supabase))) {
    process.exit(1);
  }

  // If check-only mode, exit here
  if (args.checkOnly) {
    logSuccess('\n✓ All checks passed! You can now create admin users.');
    process.exit(0);
  }

  // Step 3: Get user credentials
  let username = args.username;
  let password = args.password;

  if (!username) {
    username = await prompt('\nEnter admin username/email: ');
  }

  if (!password) {
    password = await prompt('Enter admin password: ');
  }

  // Validate password
  const validation = validatePassword(password);
  if (!validation.valid) {
    logError('\nPassword validation failed:');
    validation.errors.forEach((err) => logError(`  • ${err}`));
    process.exit(1);
  }

  // Create user
  const success = await createAdminUser(supabase, username, password, args.role);

  if (success) {
    logSection('Setup Complete!');
    logSuccess('You can now log in at: http://localhost:3000/admin/login');
    logInfo(`\nCredentials:`);
    console.log(`  Username: ${username}`);
    console.log(`  Password: ${password}`);
    logWarning('\n⚠ Store these credentials securely and delete this output!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  logError(`\nUnexpected error: ${error.message}`);
  console.error(error);
  process.exit(1);
});

