#!/usr/bin/env node

/**
 * Script to make the public_files bucket public in Supabase
 * Run with: node scripts/make-bucket-public.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function makeBucketPublic() {
  try {
    console.log('Attempting to make public_files bucket public...');
    
    // Try to update the bucket
    const { data, error } = await supabase.storage.updateBucket('public_files', {
      public: true
    });

    if (error) {
      console.error('Error updating bucket:', error);
      process.exit(1);
    }

    console.log('✅ Bucket updated successfully!');
    console.log('Bucket details:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

makeBucketPublic();

