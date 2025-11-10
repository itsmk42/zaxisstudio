export const dynamic = 'force-static';

function looksLikeJwt(value) {
  return typeof value === 'string' && value.startsWith('ey') && value.split('.').length >= 3;
}

function looksLikeUrl(value) {
  return typeof value === 'string' && /^https?:\/\//.test(value);
}

function looksLikePostgresUrl(value) {
  return typeof value === 'string' && /^postgres(ql)?:\/\//.test(value);
}

export default function EnvDiagnosticsPage() {
  const server = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
    SUPABASE_DB_URL: process.env.SUPABASE_DB_URL,
    SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET,
    SUPABASE_FUNCTIONS_URL: process.env.SUPABASE_FUNCTIONS_URL,
    SUPABASE_GRAPHQL_URL: process.env.SUPABASE_GRAPHQL_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_REGION: process.env.SUPABASE_REGION
  };

  const client = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY
  };

  const checks = [
    { key: 'SUPABASE_URL', ok: looksLikeUrl(server.SUPABASE_URL), note: 'https URL' },
    { key: 'SUPABASE_KEY', ok: !server.SUPABASE_KEY || looksLikeJwt(server.SUPABASE_KEY), note: 'JWT-like if present' },
    { key: 'SUPABASE_SERVICE_ROLE_KEY', ok: !server.SUPABASE_SERVICE_ROLE_KEY || looksLikeJwt(server.SUPABASE_SERVICE_ROLE_KEY), note: 'JWT-like if present' },
    { key: 'SUPABASE_JWT_SECRET', ok: !!server.SUPABASE_JWT_SECRET, note: 'present' },
    { key: 'SUPABASE_DB_URL', ok: !server.SUPABASE_DB_URL || looksLikePostgresUrl(server.SUPABASE_DB_URL), note: 'postgres URL if present' },
    { key: 'SUPABASE_STORAGE_BUCKET', ok: !!server.SUPABASE_STORAGE_BUCKET, note: 'present' },
    { key: 'SUPABASE_FUNCTIONS_URL', ok: !server.SUPABASE_FUNCTIONS_URL || looksLikeUrl(server.SUPABASE_FUNCTIONS_URL), note: 'https URL if present' },
    { key: 'SUPABASE_GRAPHQL_URL', ok: !server.SUPABASE_GRAPHQL_URL || looksLikeUrl(server.SUPABASE_GRAPHQL_URL), note: 'https URL if present' },
    { key: 'SUPABASE_ANON_KEY', ok: !server.SUPABASE_ANON_KEY || looksLikeJwt(server.SUPABASE_ANON_KEY), note: 'JWT-like if present' },
    { key: 'SUPABASE_REGION', ok: !!server.SUPABASE_REGION || server.SUPABASE_REGION === '', note: 'optional' },
    { key: 'NEXT_PUBLIC_SUPABASE_URL', ok: looksLikeUrl(client.NEXT_PUBLIC_SUPABASE_URL), note: 'https URL' },
    { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', ok: !client.NEXT_PUBLIC_SUPABASE_ANON_KEY || looksLikeJwt(client.NEXT_PUBLIC_SUPABASE_ANON_KEY), note: 'JWT-like if present' },
    { key: 'NEXT_PUBLIC_SUPABASE_KEY', ok: !client.NEXT_PUBLIC_SUPABASE_KEY || looksLikeJwt(client.NEXT_PUBLIC_SUPABASE_KEY), note: 'JWT-like if present' }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: 12 }}>Environment Diagnostics</h1>
      <p style={{ marginBottom: 20 }}>This page checks presence and shape only. It does not display secret values.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', gap: 8 }}>
        {checks.map(({ key, ok, note }) => (
          <>
            <div style={{ fontFamily: 'monospace' }}>{key}</div>
            <div style={{ color: ok ? 'green' : 'red', fontWeight: 600 }}>{ok ? 'OK' : 'Missing/Invalid'}</div>
            <div style={{ color: '#666' }}>{note}</div>
          </>
        ))}
      </div>
      <p style={{ marginTop: 20, color: '#666' }}>Note: Server client uses SUPABASE_URL; GraphQL URL is not used as the base.</p>
    </div>
  );
}

