# Zaxis Studio - Admin Setup Scripts

This directory contains automated scripts for managing admin users in Zaxis Studio.

## Available Scripts

### 1. `setup-admin.js` - Create Admin Users

Automated script to create admin users with full validation and error checking.

**Quick Start:**
```bash
npm run setup:admin
```

**Features:**
- ✅ Environment variable validation
- ✅ Database table verification
- ✅ Password strength validation
- ✅ Bcrypt password hashing
- ✅ Interactive or command-line mode
- ✅ Colored terminal output
- ✅ Detailed error messages

**Usage:**
```bash
# Interactive mode (recommended for first-time setup)
npm run setup:admin

# With command-line arguments
npm run setup:admin -- --username admin@example.com --password "SecurePass123!"

# Check environment only (no user creation)
npm run setup:check

# Show help
npm run setup:admin -- --help
```

**See:** [ADMIN_SETUP_GUIDE.md](./ADMIN_SETUP_GUIDE.md) for complete documentation.

---

### 2. `verify-admin.js` - Verify Admin Users

Check existing admin users and their status.

**Quick Start:**
```bash
npm run verify:admin
```

**Features:**
- ✅ List all admin users
- ✅ Show user details (ID, username, role, created date)
- ✅ Display account status (active/locked)
- ✅ Check for lockout status
- ✅ Filter by username

**Usage:**
```bash
# List all admin users
npm run verify:admin

# Check specific user
npm run verify:admin -- --username admin@example.com
```

---

## Prerequisites

### Required Environment Variables

Create `.env.local` in the project root:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key

# Admin Session Secret
ADMIN_SESSION_SECRET=your-random-secret-at-least-32-characters

# Optional (for client-side)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
```

### Required Database Tables

Run these SQL migrations in Supabase SQL Editor:

**1. Create admin_users table:**
```sql
create table if not exists public.admin_users (
  id bigserial primary key,
  username text unique not null,
  password_hash text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create index if not exists admin_users_username_idx on public.admin_users (username);
```

**2. Add lockout protection:**
```sql
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

Or simply run the SQL files:
- `db/admin_users.sql`
- `db/admin_users_lockout.sql`

---

## Common Workflows

### First-Time Setup

1. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

2. **Run database migrations:**
   - Open Supabase Dashboard → SQL Editor
   - Run `db/admin_users.sql`
   - Run `db/admin_users_lockout.sql`

3. **Verify setup:**
   ```bash
   npm run setup:check
   ```

4. **Create first admin user:**
   ```bash
   npm run setup:admin
   ```

5. **Verify user was created:**
   ```bash
   npm run verify:admin
   ```

6. **Test login:**
   ```bash
   npm run dev
   # Navigate to http://localhost:3000/admin/login
   ```

---

### Creating Additional Admin Users

```bash
npm run setup:admin -- --username newadmin@example.com --password "SecurePass123!"
```

---

### Resetting Admin Password

```bash
# Same command as creating - it will update existing user
npm run setup:admin -- --username existing@admin.com --password "NewPassword123!"
```

---

### Checking Admin User Status

```bash
# List all admins
npm run verify:admin

# Check specific admin
npm run verify:admin -- --username admin@example.com
```

---

### Unlocking Locked Account

If an account is locked due to failed login attempts:

**Option 1: Wait 15 minutes** (automatic unlock)

**Option 2: Manual unlock via SQL:**
```sql
UPDATE public.admin_users 
SET failed_attempts = 0, 
    locked_until = NULL,
    last_failed_at = NULL
WHERE username = 'admin@example.com';
```

---

## Password Requirements

All passwords must meet these requirements:

- ✅ **Minimum 12 characters**
- ✅ **At least 1 uppercase letter** (A-Z)
- ✅ **At least 1 lowercase letter** (a-z)
- ✅ **At least 1 number** (0-9)
- ✅ **At least 1 special character** (!@#$%^&*, etc.)

**Valid Examples:**
- `AdminPass123!@#`
- `Secure2024$Admin`
- `MyP@ssw0rd2024!`

**Invalid Examples:**
- `admin123` ❌ Too short, no uppercase, no special char
- `AdminPassword` ❌ No number, no special char
- `ADMIN123!` ❌ No lowercase

---

## Troubleshooting

### "Missing required environment variable"

**Problem:** Environment variables not loaded.

**Solution:**
1. Ensure `.env.local` exists in project root
2. Check variable names match exactly
3. Restart your terminal/IDE
4. Run `npm run setup:check` to verify

---

### "Table 'admin_users' does not exist"

**Problem:** Database migrations not run.

**Solution:**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run `db/admin_users.sql`
4. Run `db/admin_users_lockout.sql`
5. Run `npm run setup:check` to verify

---

### "Password validation failed"

**Problem:** Password doesn't meet requirements.

**Solution:** Use a password that includes:
- At least 12 characters
- Uppercase and lowercase letters
- At least one number
- At least one special character

Example: `AdminPass123!`

---

### "SUPABASE_SERVICE_ROLE_KEY should be a JWT token"

**Problem:** Wrong Supabase key used.

**Solution:**
1. Go to Supabase Dashboard → Settings → API
2. Copy the **service_role** key (NOT anon key)
3. It should start with `eyJhbGc...`
4. Update `.env.local`

---

### "Cannot find module"

**Problem:** Dependencies not installed.

**Solution:**
```bash
npm install
```

---

## Security Notes

1. **Never commit `.env.local`** - It contains sensitive keys
2. **Use strong passwords** - Follow the password requirements
3. **Rotate secrets regularly** - Update `ADMIN_SESSION_SECRET` periodically
4. **Monitor failed logins** - Check Supabase logs for suspicious activity
5. **Use HTTPS in production** - Admin routes enforce HTTPS automatically
6. **Limit admin users** - Only create accounts for trusted administrators

---

## Related Documentation

- [ADMIN_SETUP_GUIDE.md](./ADMIN_SETUP_GUIDE.md) - Detailed setup guide
- [../README.md](../README.md) - Main project documentation
- [../db/admin_users.sql](../db/admin_users.sql) - Database schema
- [../db/admin_users_lockout.sql](../db/admin_users_lockout.sql) - Lockout protection

---

## Support

If you encounter issues:

1. Run `npm run setup:check` to diagnose problems
2. Check Supabase Dashboard for database errors
3. Verify environment variables are set correctly
4. Review the [ADMIN_SETUP_GUIDE.md](./ADMIN_SETUP_GUIDE.md)
5. Check the main [README.md](../README.md) for environment setup

---

## Script Details

### setup-admin.js

**What it does:**
1. Validates all required environment variables
2. Checks database tables exist and are configured
3. Validates password meets security requirements
4. Hashes password using bcrypt (12 rounds)
5. Creates or updates admin user in database
6. Displays success message with user details

**Exit codes:**
- `0` - Success
- `1` - Error (check output for details)

### verify-admin.js

**What it does:**
1. Connects to Supabase using service role key
2. Queries admin_users table
3. Displays user information and status
4. Shows lockout status if applicable

**Exit codes:**
- `0` - Success (users found)
- `1` - Error or no users found

