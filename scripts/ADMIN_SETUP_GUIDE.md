# Admin User Setup Guide

This guide explains how to use the automated admin setup script for Zaxis Studio.

## Quick Start

### 1. Ensure Environment Variables are Set

Create or update `.env.local` in the project root:

```env
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
ADMIN_SESSION_SECRET=your-random-secret-at-least-32-characters

# Optional but recommended
SUPABASE_KEY=eyJhbGc...your-anon-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
```

### 2. Run Database Migrations

Open Supabase SQL Editor and run:

```sql
-- Create admin_users table
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
end $$;
```

### 3. Run the Setup Script

#### Option A: Interactive Mode (Recommended)

```bash
npm run setup:admin
```

The script will prompt you for:
- Admin username/email
- Admin password

#### Option B: Command-Line Arguments

```bash
npm run setup:admin -- --username admin@example.com --password "SecurePass123!"
```

#### Option C: Check Environment Only

```bash
npm run setup:check
```

This validates your environment and database without creating a user.

## Script Usage

### Command-Line Options

```bash
node scripts/setup-admin.js [options]

Options:
  -u, --username <email>    Admin username/email
  -p, --password <pass>     Admin password
  -r, --role <role>         Admin role (default: admin)
  -c, --check-only          Only check environment and database
  -h, --help                Show help message
```

### Examples

**Interactive mode:**
```bash
npm run setup:admin
```

**With credentials:**
```bash
npm run setup:admin -- --username admin@zaxisstudio.com --password "MySecure123!Pass"
```

**Check environment only:**
```bash
npm run setup:check
```

**Custom role:**
```bash
npm run setup:admin -- --username superadmin@example.com --password "SuperPass123!" --role superadmin
```

## Password Requirements

Your password must meet ALL of these requirements:

- ✅ Minimum 12 characters
- ✅ At least 1 uppercase letter (A-Z)
- ✅ At least 1 lowercase letter (a-z)
- ✅ At least 1 number (0-9)
- ✅ At least 1 special character (!@#$%^&*, etc.)

### Valid Password Examples

- `AdminPass123!@#`
- `Secure2024$Admin`
- `MyP@ssw0rd2024!`
- `ZaxisStudio#2024`

### Invalid Password Examples

- `admin123` - Too short, no uppercase, no special char
- `AdminPassword` - No number, no special char
- `ADMIN123!` - No lowercase
- `admin@123` - No uppercase

## What the Script Does

### Step 1: Environment Validation

Checks for required environment variables:
- `SUPABASE_URL` - Must start with `https://`
- `SUPABASE_SERVICE_ROLE_KEY` - Must be a JWT token (starts with `ey`)
- `ADMIN_SESSION_SECRET` - Should be at least 32 characters

### Step 2: Database Verification

Verifies that:
- `admin_users` table exists
- Lockout protection columns are present
- Row Level Security (RLS) is enabled

### Step 3: User Creation

- Validates password against security requirements
- Hashes password using bcrypt (12 rounds)
- Creates or updates admin user in database
- Displays user details on success

## Troubleshooting

### Error: "Missing required environment variable"

**Solution:** Add the missing variable to `.env.local`

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
ADMIN_SESSION_SECRET=random-secret-32-chars-minimum
```

### Error: "Table 'admin_users' does not exist"

**Solution:** Run the SQL migrations in Supabase SQL Editor (see Step 2 above)

### Error: "Password validation failed"

**Solution:** Ensure your password meets all requirements:
- At least 12 characters
- Mixed case (upper and lower)
- At least one number
- At least one special character

### Error: "SUPABASE_SERVICE_ROLE_KEY should be a JWT token"

**Solution:** 
1. Go to Supabase Dashboard → Settings → API
2. Copy the "service_role" key (NOT the anon key)
3. It should start with `eyJhbGc...`

### Error: "Cannot find module"

**Solution:** Install dependencies first:

```bash
npm install
```

## After Setup

### Test Your Admin Login

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/admin/login`

3. Enter your credentials

4. You should be redirected to: `http://localhost:3000/admin`

### Security Best Practices

1. **Store credentials securely** - Use a password manager
2. **Change default passwords** - If you used a simple password for testing
3. **Enable HTTPS in production** - Admin routes enforce HTTPS
4. **Rotate secrets regularly** - Update `ADMIN_SESSION_SECRET` periodically
5. **Monitor failed login attempts** - Check Supabase logs

### Managing Admin Users

**View all admin users (Supabase SQL Editor):**
```sql
SELECT id, username, role, created_at, failed_attempts, locked_until 
FROM public.admin_users 
ORDER BY created_at DESC;
```

**Reset password:**
```bash
npm run setup:admin -- --username existing@admin.com --password "NewPassword123!"
```

**Unlock locked account:**
```sql
UPDATE public.admin_users 
SET failed_attempts = 0, locked_until = NULL 
WHERE username = 'admin@example.com';
```

**Delete admin user:**
```sql
DELETE FROM public.admin_users WHERE username = 'admin@example.com';
```

## Script Output Example

```
============================================================
Zaxis Studio - Admin User Setup
============================================================

============================================================
Step 1: Validating Environment Variables
============================================================
✓ SUPABASE_URL is set
✓ SUPABASE_SERVICE_ROLE_KEY is set
✓ ADMIN_SESSION_SECRET is set
✓ SUPABASE_KEY is set
✓ NEXT_PUBLIC_SUPABASE_URL is set
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY is set

✓ All required environment variables are properly configured!

============================================================
Step 2: Verifying Database Tables
============================================================
✓ Table "admin_users" exists
✓ Lockout protection columns exist

✓ Database tables are properly configured!

============================================================
Step 3: Creating Admin User
============================================================
ℹ Hashing password...
✓ Password hashed successfully
ℹ Creating user: admin@zaxisstudio.com
✓ Admin user created successfully!

ℹ User Details:
  ID:       1
  Username: admin@zaxisstudio.com
  Role:     admin
  Created:  2024-01-15T10:30:00.000Z

============================================================
Setup Complete!
============================================================
✓ You can now log in at: http://localhost:3000/admin/login

ℹ Credentials:
  Username: admin@zaxisstudio.com
  Password: AdminPass123!

⚠ Store these credentials securely and delete this output!
```

## Support

If you encounter issues not covered in this guide:

1. Check the main README.md for environment setup
2. Verify Supabase project is active and accessible
3. Check Supabase logs for database errors
4. Ensure you're using the service role key (not anon key)
5. Try running with `--check-only` to diagnose issues

## Related Files

- `scripts/setup-admin.js` - Main setup script
- `db/admin_users.sql` - Base table migration
- `db/admin_users_lockout.sql` - Lockout protection migration
- `lib/adminAuth.js` - Admin authentication logic
- `app/api/admin/users/route.js` - Admin user API endpoint
- `app/api/admin/login/route.js` - Admin login endpoint

