import { createClient } from '@supabase/supabase-js';

// Support multiple env aliases while ensuring client-side access via NEXT_PUBLIC_*
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_KEY ||
  '';

export const supabaseBrowser = createClient(url, anonKey);
