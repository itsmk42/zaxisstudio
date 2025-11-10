function looksLikeJwt(value) {
  return typeof value === 'string' && value.startsWith('ey') && value.split('.').length >= 3;
}

function looksLikeUrl(value) {
  return typeof value === 'string' && /^https?:\/\//.test(value);
}

function looksLikePostgresUrl(value) {
  return typeof value === 'string' && /^postgres(ql)?:\/\//.test(value);
}

export function validateClientEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;
  if (!url || !looksLikeUrl(url)) {
    console.warn('[env] NEXT_PUBLIC_SUPABASE_URL missing or invalid. Expected https://...');
  }
  if (!key || !looksLikeJwt(key)) {
    console.warn('[env] NEXT_PUBLIC_SUPABASE_ANON_KEY/KEY missing or invalid JWT-like string.');
  }
}

export function validateServerEnv() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_GRAPHQL_URL;
  const anon = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dbUrl = process.env.SUPABASE_DB_URL;

  if (!url || !looksLikeUrl(url)) {
    console.warn('[env] SUPABASE_URL missing or invalid. Expected https://...');
  }
  if (anon && !looksLikeJwt(anon)) {
    console.warn('[env] SUPABASE_KEY/ANON_KEY present but not JWT-like.');
  }
  if (service && !looksLikeJwt(service)) {
    console.warn('[env] SUPABASE_SERVICE_ROLE_KEY present but not JWT-like.');
  }
  if (dbUrl && !looksLikePostgresUrl(dbUrl)) {
    console.warn('[env] SUPABASE_DB_URL present but invalid. Expected postgresql:// or postgres://');
  }
}

