# Quick Start: Admin User Setup

This guide will get you up and running with an admin account in **5 minutes**.

## Step 1: Set Environment Variables (2 min)

Create `.env.local` in the project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
ADMIN_SESSION_SECRET=random-secret-at-least-32-characters-long
```

**Where to find these values:**
- Go to [Supabase Dashboard](https://app.supabase.com)
- Select your project
- Go to **Settings** → **API**
- Copy:
  - **Project URL** → `SUPABASE_URL`
  - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ NOT the anon key!)
- For `ADMIN_SESSION_SECRET`, generate a random string:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

---

## Step 2: Run Database Migrations (1 min)

1. Open [Supabase SQL Editor](https://app.supabase.com) → SQL Editor
2. Copy and paste this SQL:

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

3. Click **Run** (or press Cmd/Ctrl + Enter)

---

## Step 3: Create Admin User (1 min)

Run the automated setup script:

```bash
npm run setup:admin
```

When prompted, enter:
- **Username:** `admin@zaxisstudio.com` (or your preferred email)
- **Password:** A secure password with:
  - At least 12 characters
  - Uppercase + lowercase letters
  - At least 1 number
  - At least 1 special character
  - Example: `AdminPass123!`

---

## Step 4: Test Login (1 min)

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open: http://localhost:3000/admin/login

3. Enter your credentials

4. You should be redirected to: http://localhost:3000/admin

---

## ✅ Done!

You now have a working admin account. You can:
- Manage products at `/admin/products`
- View orders at `/admin/orders`
- Configure SEO at `/admin/seo`

---

## Troubleshooting

### ❌ "Missing required environment variable"

**Fix:** Check that `.env.local` exists and contains all three variables.

```bash
# Verify environment
npm run setup:check
```

---

### ❌ "Table 'admin_users' does not exist"

**Fix:** Run the SQL migrations in Step 2 again.

---

### ❌ "Invalid username or password" when logging in

**Fix:** Reset your password:

```bash
npm run setup:admin -- --username admin@zaxisstudio.com --password "NewPassword123!"
```

---

### ❌ "Password validation failed"

**Fix:** Use a stronger password. Example: `AdminPass123!`

Requirements:
- ✅ 12+ characters
- ✅ Uppercase (A-Z)
- ✅ Lowercase (a-z)
- ✅ Number (0-9)
- ✅ Special char (!@#$%^&*)

---

## Useful Commands

```bash
# Create admin user (interactive)
npm run setup:admin

# Create admin user (command-line)
npm run setup:admin -- --username admin@example.com --password "SecurePass123!"

# Check environment and database
npm run setup:check

# Verify admin users exist
npm run verify:admin

# Show help
npm run setup:admin -- --help
```

---

## Next Steps

- **Change default password** if you used a simple one for testing
- **Store credentials securely** in a password manager
- **Create additional admin users** if needed
- **Review security settings** in Supabase Dashboard

---

## Need More Help?

- **Detailed Guide:** [scripts/ADMIN_SETUP_GUIDE.md](scripts/ADMIN_SETUP_GUIDE.md)
- **Scripts Documentation:** [scripts/README.md](scripts/README.md)
- **Main README:** [README.md](README.md)

---

## Security Reminders

- 🔒 Never commit `.env.local` to git
- 🔒 Use strong, unique passwords
- 🔒 Enable HTTPS in production (automatic)
- 🔒 Rotate `ADMIN_SESSION_SECRET` periodically
- 🔒 Monitor failed login attempts in Supabase logs

