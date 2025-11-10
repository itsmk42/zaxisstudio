# Zaxis Studio — Environment Configuration

This project uses Supabase for data and auth. Configure environment variables for local development and production.

## Required Supabase Environment Variables

- `SUPABASE_URL`: Full URL to your Supabase project (e.g., `https://xyzabc.supabase.co`)
- `SUPABASE_KEY`: Project public/anonymous key (starts with `ey`)
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (elevated privileges; backend only)
- `SUPABASE_JWT_SECRET`: Project JWT secret (Project Settings → API)
- `SUPABASE_DB_URL`: Full connection string for direct DB access

## Additional Recommended Variables

- `SUPABASE_STORAGE_BUCKET`: Default bucket name for file storage
- `SUPABASE_FUNCTIONS_URL`: Base URL for Edge Functions
- `SUPABASE_GRAPHQL_URL`: GraphQL endpoint
- `SUPABASE_ANON_KEY`: Alias for `SUPABASE_KEY` (compatibility)
- `SUPABASE_REGION`: Regional deployment hint

## Client vs Server Variables

- Client-side code can only read variables prefixed with `NEXT_PUBLIC_` at build time.
- Server-side code can read secure variables without the prefix.

We expose the browser client as:

- `NEXT_PUBLIC_SUPABASE_URL` → Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_KEY` → public/anon key

## .env Setup

Create an `.env` at the project root and keep placeholders exactly as shown.

```env
# Server-side (secure)
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_KEY=${SUPABASE_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
SUPABASE_JWT_SECRET=${SUPABASE_JWT_SECRET}
SUPABASE_DB_URL=${SUPABASE_DB_URL}
SUPABASE_STORAGE_BUCKET=${SUPABASE_STORAGE_BUCKET}
SUPABASE_FUNCTIONS_URL=${SUPABASE_FUNCTIONS_URL}
SUPABASE_GRAPHQL_URL=${SUPABASE_GRAPHQL_URL}
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
SUPABASE_REGION=${SUPABASE_REGION}

# Client-side (public)
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_KEY}
# or
NEXT_PUBLIC_SUPABASE_KEY=${SUPABASE_KEY}
```

### Important

- Do not put real secrets into `.env.example`. Use `.env.local` for actual values; it is already ignored by Git.
- If you accidentally committed secrets, rotate the affected keys immediately in Supabase.

## Security Considerations

- Do not commit `.env` files to version control.
- Restrict access to `SUPABASE_SERVICE_ROLE_KEY` to backend services only.
- Rotate keys periodically and after suspected exposure.
- Consider a secrets manager (e.g., Vercel/Netlify env, AWS Secrets Manager) in production.

## Production Configuration

- Configure environment variables via your hosting provider’s settings (e.g., Vercel Project → Settings → Environment Variables).
- Only set `NEXT_PUBLIC_*` variables if they are safe for browser exposure.

## Testing Requirements

- Verify env loading locally: `npm run dev` and ensure no runtime errors.
- Test API with public key (client reads) and service role key (server reads):
  - Client calls should succeed with anon permissions.
  - Server actions/routes can use service role for admin operations.
- Validate JWT generation and verification using `SUPABASE_JWT_SECRET` where applicable.

## Notes

- The codebase accepts multiple env aliases for compatibility.
  - Browser client reads `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_KEY`.
  - Server reads `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_KEY`, or `SUPABASE_ANON_KEY`.
  
## Database Setup

Products, Orders, and SEO features rely on Supabase/Postgres tables.

- Products: create with `db/products.sql`
  - Open Supabase SQL editor and run the contents of `db/products.sql` to create `public.products`.
  - Columns: `id`, `title`, `price`, `image_url`, `created_at`.

- Admin Users: create with `db/admin_users.sql`
  - Use the SQL file to create `public.admin_users` and index on `username`.

Server writes require `SUPABASE_SERVICE_ROLE_KEY` to be set.

### Troubleshooting product creation

- Error: `table_missing` or `Could not find the table 'public.products'`
  - Action: Ensure `public.products` exists by running `db/products.sql`.
  - Verify env: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set.

- Error: `validation_failed`
  - Action: Provide a non-empty `title` and `price >= 0`.

- Error: permissions/RLS
  - Action: Use `SUPABASE_SERVICE_ROLE_KEY` for server writes or configure RLS policies as needed.
## Admin Account & Security

This project now uses a database-backed admin account with bcrypt hashing, signed session cookies, and CSRF protection.

### Setup

1. Run the SQL below in Supabase (SQL Editor):

```
-- db/admin_users.sql
create table if not exists public.admin_users (
  id bigserial primary key,
  username text unique not null,
  password_hash text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);
create index if not exists admin_users_username_idx on public.admin_users (username);
```

2. Seed the admin user (using local dev server):

```
curl -X POST http://localhost:3000/api/admin/users \
  -H 'Content-Type: application/json' \
  -d '{"username":"m42k@admin","password":"Ss@1234q","role":"admin"}'
```

3. Access the admin login at `/admin/login`. The form uses CSRF tokens and sets an `admin_session` cookie with `httpOnly`, `sameSite=Strict`, and `secure` (in production).

### Notes

- Ensure `ADMIN_SESSION_SECRET` is set in `.env.local` and deploy on HTTPS so cookies are marked `secure`.
- Middleware verifies the signed session and restricts `/admin/*` routes to `role=admin` users.
- The legacy `ADMIN_PASSWORD` cookie check is removed.
