# 🎉 Admin Setup Scripts - Complete Package

Your admin user setup automation is now complete! This document provides an overview of everything that has been created.

## 📦 What's Been Created

### 1. **Automated Setup Script** (`scripts/setup-admin.js`)
A comprehensive Node.js script that automates admin user creation with:
- ✅ Environment variable validation
- ✅ Database table verification  
- ✅ Password strength validation
- ✅ Bcrypt password hashing (12 rounds)
- ✅ Interactive or command-line mode
- ✅ Colored terminal output
- ✅ Detailed error messages and hints

### 2. **Verification Script** (`scripts/verify-admin.js`)
Check existing admin users and their status:
- ✅ List all admin users
- ✅ Show user details (ID, username, role, created date)
- ✅ Display account status (active/locked)
- ✅ Filter by username

### 3. **Environment Checker** (`scripts/check-env.js`)
Quick diagnostic tool to verify environment variables:
- ✅ Validates required variables
- ✅ Checks optional variables
- ✅ Provides helpful hints for missing values
- ✅ Shows masked values for security

### 4. **Documentation**
- ✅ `QUICK_START_ADMIN.md` - 5-minute quick start guide
- ✅ `scripts/ADMIN_SETUP_GUIDE.md` - Comprehensive setup guide
- ✅ `scripts/README.md` - Scripts documentation
- ✅ `ADMIN_SETUP_COMPLETE.md` - This file

### 5. **NPM Scripts** (added to `package.json`)
```json
{
  "scripts": {
    "setup:admin": "node scripts/setup-admin.js",
    "setup:check": "node scripts/setup-admin.js --check-only",
    "verify:admin": "node scripts/verify-admin.js",
    "check:env": "node scripts/check-env.js"
  }
}
```

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Check Environment (30 seconds)
```bash
npm run check:env
```

This will tell you exactly what environment variables are missing.

### Step 2: Set Environment Variables (2 minutes)

Create `.env.local` in the project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
ADMIN_SESSION_SECRET=your-random-secret-at-least-32-chars
```

**Get Supabase credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy **Project URL** and **service_role** key

**Generate session secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Run Database Migrations (1 minute)

Open Supabase SQL Editor and run:
```sql
-- Run db/admin_users.sql
create table if not exists public.admin_users (
  id bigserial primary key,
  username text unique not null,
  password_hash text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create index if not exists admin_users_username_idx on public.admin_users (username);

-- Run db/admin_users_lockout.sql
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

### Step 4: Verify Setup (30 seconds)
```bash
npm run setup:check
```

Should show all green checkmarks ✓

### Step 5: Create Admin User (1 minute)
```bash
npm run setup:admin
```

Enter:
- **Username:** `admin@zaxisstudio.com`
- **Password:** `AdminPass123!` (or your preferred secure password)

### Step 6: Test Login (30 seconds)
```bash
npm run dev
```

Navigate to: http://localhost:3000/admin/login

---

## 📚 Available Commands

### Environment & Setup
```bash
# Check environment variables
npm run check:env

# Check environment and database (no user creation)
npm run setup:check
```

### Admin User Management
```bash
# Create admin user (interactive)
npm run setup:admin

# Create admin user (command-line)
npm run setup:admin -- --username admin@example.com --password "SecurePass123!"

# Verify admin users exist
npm run verify:admin

# Verify specific user
npm run verify:admin -- --username admin@example.com

# Show help
npm run setup:admin -- --help
```

---

## 🔐 Password Requirements

All passwords must include:
- ✅ **12+ characters**
- ✅ **Uppercase letter** (A-Z)
- ✅ **Lowercase letter** (a-z)
- ✅ **Number** (0-9)
- ✅ **Special character** (!@#$%^&*, etc.)

**Valid Examples:**
- `AdminPass123!@#`
- `Secure2024$Admin`
- `MyP@ssw0rd2024!`

---

## 🛠️ Common Tasks

### Reset Admin Password
```bash
npm run setup:admin -- --username existing@admin.com --password "NewPassword123!"
```

### Create Additional Admin
```bash
npm run setup:admin -- --username newadmin@example.com --password "SecurePass123!"
```

### Check All Admin Users
```bash
npm run verify:admin
```

### Unlock Locked Account (SQL)
```sql
UPDATE public.admin_users 
SET failed_attempts = 0, locked_until = NULL 
WHERE username = 'admin@example.com';
```

---

## 🐛 Troubleshooting

### Issue: "Missing required environment variable"

**Quick Fix:**
```bash
npm run check:env
```

Follow the hints to add missing variables to `.env.local`

---

### Issue: "Table 'admin_users' does not exist"

**Quick Fix:**
1. Open Supabase SQL Editor
2. Run `db/admin_users.sql`
3. Run `db/admin_users_lockout.sql`
4. Verify: `npm run setup:check`

---

### Issue: "Invalid username or password" when logging in

**Quick Fix:**
```bash
# Reset password
npm run setup:admin -- --username admin@zaxisstudio.com --password "NewPassword123!"
```

---

### Issue: "Password validation failed"

**Quick Fix:** Use a stronger password

Example: `AdminPass123!`

Must have:
- 12+ characters
- Uppercase + lowercase
- Number
- Special character

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `QUICK_START_ADMIN.md` | 5-minute quick start guide |
| `scripts/ADMIN_SETUP_GUIDE.md` | Comprehensive setup documentation |
| `scripts/README.md` | Scripts reference and workflows |
| `ADMIN_SETUP_COMPLETE.md` | This overview document |

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use strong passwords** - Follow password requirements
3. **Rotate secrets** - Update `ADMIN_SESSION_SECRET` periodically
4. **Monitor logins** - Check Supabase logs for suspicious activity
5. **HTTPS in production** - Automatically enforced by middleware
6. **Limit admin users** - Only create for trusted administrators

---

## 🎯 What Each Script Does

### `setup-admin.js`
**Purpose:** Create or update admin users

**Process:**
1. Validates environment variables
2. Checks database tables exist
3. Validates password strength
4. Hashes password with bcrypt
5. Creates/updates user in database
6. Shows success message

**Usage:**
```bash
npm run setup:admin
npm run setup:admin -- --username admin@example.com --password "Pass123!"
npm run setup:check  # Check only, don't create user
```

---

### `verify-admin.js`
**Purpose:** List and verify admin users

**Process:**
1. Connects to Supabase
2. Queries admin_users table
3. Displays user information
4. Shows lockout status

**Usage:**
```bash
npm run verify:admin
npm run verify:admin -- --username admin@example.com
```

---

### `check-env.js`
**Purpose:** Validate environment variables

**Process:**
1. Checks required variables exist
2. Validates variable formats
3. Checks optional variables
4. Provides helpful hints

**Usage:**
```bash
npm run check:env
```

---

## 🎓 Learning Resources

### Understanding the Admin System

1. **Authentication Flow:**
   - User submits credentials at `/admin/login`
   - CSRF token validated
   - Password checked with bcrypt
   - Session cookie created (signed JWT)
   - Middleware protects `/admin/*` routes

2. **Security Features:**
   - Bcrypt password hashing (12 rounds)
   - CSRF protection
   - Account lockout (5 failed attempts = 15 min lock)
   - Signed session cookies (httpOnly, sameSite=Strict)
   - Row Level Security on database
   - HTTPS enforcement in production

3. **Database Schema:**
   - `id` - Primary key
   - `username` - Unique identifier
   - `password_hash` - Bcrypt hashed password
   - `role` - User role (admin, superadmin)
   - `created_at` - Account creation timestamp
   - `failed_attempts` - Failed login counter
   - `locked_until` - Lockout expiration
   - `last_failed_at` - Last failed login timestamp

---

## 🚦 Next Steps

After setting up your admin account:

1. **Test the admin dashboard:**
   - Products: http://localhost:3000/admin/products
   - Orders: http://localhost:3000/admin/orders
   - SEO: http://localhost:3000/admin/seo

2. **Customize as needed:**
   - Change default password
   - Create additional admin users
   - Configure Supabase RLS policies

3. **Deploy to production:**
   - Set environment variables in hosting provider
   - Verify HTTPS is enabled
   - Test admin login in production

---

## 💡 Tips

- **Use `npm run check:env`** before any admin operations
- **Run `npm run verify:admin`** to check user status
- **Keep credentials in a password manager**
- **Test in development before deploying**
- **Monitor Supabase logs** for security events

---

## 📞 Support

If you encounter issues:

1. Run `npm run check:env` to diagnose
2. Check `scripts/ADMIN_SETUP_GUIDE.md` for detailed help
3. Review Supabase Dashboard for database errors
4. Verify environment variables are correct
5. Check main `README.md` for project setup

---

## ✅ Success Checklist

- [ ] Environment variables set in `.env.local`
- [ ] `npm run check:env` shows all green
- [ ] Database tables created in Supabase
- [ ] `npm run setup:check` passes
- [ ] Admin user created with `npm run setup:admin`
- [ ] `npm run verify:admin` shows your user
- [ ] Can log in at `/admin/login`
- [ ] Can access `/admin` dashboard
- [ ] Credentials stored securely

---

**🎉 Congratulations!** Your admin setup automation is complete and ready to use!

For detailed documentation, see:
- Quick Start: `QUICK_START_ADMIN.md`
- Full Guide: `scripts/ADMIN_SETUP_GUIDE.md`
- Scripts Docs: `scripts/README.md`

