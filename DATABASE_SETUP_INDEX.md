# Database Setup - Complete Index

## 🚨 Problem You're Facing

```
Error: "Could not find the table 'public.categories' in the schema cache"
```

This error occurs because the `categories` table (and possibly other tables) don't exist in your Supabase database.

---

## 📚 Documentation Files Created

### 1. **QUICK_FIX_GUIDE.md** ⭐ START HERE
- **Best for:** Quick 5-minute fix
- **Contains:** Minimal SQL code to create just the categories table
- **Time:** 5 minutes
- **When to use:** You just need to fix the error quickly

### 2. **SUPABASE_SQL_EDITOR_GUIDE.md** 
- **Best for:** Step-by-step visual instructions
- **Contains:** How to access Supabase, open SQL editor, run queries
- **Time:** 10 minutes to read
- **When to use:** First time using Supabase SQL Editor

### 3. **DATABASE_SETUP_GUIDE.md**
- **Best for:** Comprehensive setup with explanations
- **Contains:** Detailed instructions, verification queries, troubleshooting
- **Time:** 20 minutes to read
- **When to use:** You want to understand what you're doing

### 4. **DATABASE_SCHEMA_REFERENCE.md**
- **Best for:** Understanding your database structure
- **Contains:** Table schemas, data types, relationships, example data
- **Time:** 15 minutes to read
- **When to use:** You need to understand the database design

### 5. **This File (DATABASE_SETUP_INDEX.md)**
- **Best for:** Navigation and overview
- **Contains:** Index of all files and what each does
- **Time:** 5 minutes to read
- **When to use:** You're lost and need guidance

---

## 🗂️ SQL Files

### 1. **database-setup.sql** ⭐ RECOMMENDED
- **Contains:** Complete setup for all 4 tables
- **Tables created:**
  - categories
  - products
  - carousel_slides
  - orders
- **Includes:** RLS policies, indexes, constraints
- **Size:** ~5.3 KB
- **Time to run:** 2-3 seconds
- **When to use:** First time setup or complete reset

### 2. **database-setup-individual.sql**
- **Contains:** Individual table creation scripts
- **Tables:** Same 4 tables, but separated
- **Includes:** RLS policies, indexes for each table
- **Size:** ~4.9 KB
- **When to use:** You need to create tables one at a time

---

## 🎯 Quick Start (Choose Your Path)

### Path 1: I Just Want It Fixed (5 minutes)
1. Read: **QUICK_FIX_GUIDE.md**
2. Run: Copy the SQL code from the guide
3. Paste into: Supabase SQL Editor
4. Click: Run
5. Done!

### Path 2: I'm New to Supabase (15 minutes)
1. Read: **SUPABASE_SQL_EDITOR_GUIDE.md**
2. Follow: Step-by-step instructions
3. Run: **database-setup.sql** code
4. Verify: Using provided verification queries
5. Done!

### Path 3: I Want to Understand Everything (30 minutes)
1. Read: **DATABASE_SETUP_GUIDE.md**
2. Read: **DATABASE_SCHEMA_REFERENCE.md**
3. Run: **database-setup.sql** code
4. Verify: Using all verification queries
5. Explore: Your database structure
6. Done!

### Path 4: I Need Individual Tables (20 minutes)
1. Read: **DATABASE_SETUP_GUIDE.md**
2. Run: **database-setup-individual.sql** code
3. Create: Tables one at a time as needed
4. Verify: Each table creation
5. Done!

---

## 📋 What Each Table Does

| Table | Purpose | Status |
|-------|---------|--------|
| **categories** | Product categories | ❌ MISSING (causing error) |
| **products** | Product information | ✅ May exist |
| **carousel_slides** | Homepage carousel | ✅ May exist |
| **orders** | Customer orders | ✅ May exist |

---

## ✅ Verification Checklist

After running the SQL setup:

- [ ] No error messages in SQL Editor
- [ ] Query shows "Success" message
- [ ] Can run `SELECT * FROM public.categories;` without error
- [ ] Development server restarted (`npm run dev`)
- [ ] Admin panel loads without errors
- [ ] Can add a category in admin panel
- [ ] Can add a product in admin panel
- [ ] Can add a carousel slide in admin panel

---

## 🔧 How to Use These Files

### Step 1: Choose Your Path (Above)

### Step 2: Read the Appropriate Guide
- Quick fix? → Read QUICK_FIX_GUIDE.md
- New to Supabase? → Read SUPABASE_SQL_EDITOR_GUIDE.md
- Want details? → Read DATABASE_SETUP_GUIDE.md
- Need reference? → Read DATABASE_SCHEMA_REFERENCE.md

### Step 3: Copy SQL Code
- Quick fix? → Copy from QUICK_FIX_GUIDE.md
- Complete setup? → Copy from database-setup.sql
- Individual tables? → Copy from database-setup-individual.sql

### Step 4: Run in Supabase
1. Go to https://app.supabase.com
2. Select "zaxisstudio" project
3. Click "SQL Editor"
4. Click "New Query"
5. Paste the SQL code
6. Click "Run"

### Step 5: Verify Success
1. Check for "Success" message
2. Run verification queries
3. Restart dev server: `npm run dev`
4. Test admin panel

---

## 🆘 Troubleshooting

### Error: "Table already exists"
✅ **This is fine!** The script uses `CREATE TABLE IF NOT EXISTS`
- It won't recreate tables that already exist
- Just run the verification query to confirm

### Error: "Permission denied"
❌ **You need admin access**
- Make sure you're logged in as project owner
- Check your Supabase account permissions

### Error: "Syntax error"
❌ **SQL code has an issue**
- Copy the code again from the provided files
- Make sure you're using the exact code provided
- Check for missing semicolons

### Still getting "table not found" error
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh page (Ctrl+Shift+R)
3. Wait 30 seconds for Supabase cache to refresh
4. Restart dev server: `npm run dev`

---

## 📞 File Locations

All files are in your project root directory:

```
/Users/mk42/Documents/zaxisstudio.com/
├── database-setup.sql                    (Complete SQL setup)
├── database-setup-individual.sql         (Individual table scripts)
├── QUICK_FIX_GUIDE.md                   (5-minute fix)
├── SUPABASE_SQL_EDITOR_GUIDE.md         (How to use SQL Editor)
├── DATABASE_SETUP_GUIDE.md              (Detailed guide)
├── DATABASE_SCHEMA_REFERENCE.md         (Schema reference)
└── DATABASE_SETUP_INDEX.md              (This file)
```

---

## 🎓 Learning Resources

### Supabase Documentation
- Main docs: https://supabase.com/docs
- SQL Editor: https://supabase.com/docs/guides/database/sql-editor
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security

### PostgreSQL Documentation
- Data types: https://www.postgresql.org/docs/current/datatype.html
- SQL syntax: https://www.postgresql.org/docs/current/sql.html

---

## 🚀 Next Steps After Setup

1. ✅ Create all tables using SQL
2. ✅ Verify tables exist
3. ✅ Restart development server
4. ✅ Test admin panel:
   - Add a category
   - Add a product
   - Add carousel slide
   - Create an order
5. ✅ Verify no errors appear
6. ✅ Deploy to production

---

## 📊 Database Schema Diagram

See the visual diagram in the DATABASE_SETUP_GUIDE.md file for a complete ER diagram showing:
- All 4 tables
- Column names and types
- Relationships between tables
- Primary keys and constraints

---

## 💡 Pro Tips

1. **Always backup** - Save your SQL scripts in version control
2. **Use indexes** - Improves query performance (already included)
3. **Enable RLS** - Always enable Row Level Security (already included)
4. **Test queries** - Run verification queries after setup
5. **Monitor performance** - Check query execution times
6. **Document changes** - Keep track of schema modifications

---

## ✨ Summary

You have everything you need to fix the database error:

1. **SQL Files:** Ready-to-run SQL code
2. **Guides:** Step-by-step instructions
3. **Reference:** Complete schema documentation
4. **Troubleshooting:** Common issues and solutions

**Choose your path above and get started!** 🎉

---

## Questions?

Refer to the appropriate guide:
- **"How do I run SQL?"** → SUPABASE_SQL_EDITOR_GUIDE.md
- **"What's the error?"** → QUICK_FIX_GUIDE.md
- **"What do these tables do?"** → DATABASE_SCHEMA_REFERENCE.md
- **"I need detailed help"** → DATABASE_SETUP_GUIDE.md

