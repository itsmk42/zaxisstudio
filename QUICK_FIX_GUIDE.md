# Quick Fix Guide - Categories Table Error

## 🚨 Problem
```
Error: "Could not find the table 'public.categories' in the schema cache"
```

## ✅ Solution (5 Minutes)

### Step 1: Open Supabase SQL Editor
```
1. Go to https://app.supabase.com
2. Select "zaxisstudio" project
3. Click "SQL Editor" in left sidebar
4. Click "New Query"
```

### Step 2: Copy & Paste SQL
Copy this entire block and paste into the SQL Editor:

```sql
-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON public.categories FOR ALL USING (auth.role() = 'authenticated');

-- Create index
CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories(name);
```

### Step 3: Run Query
- Click **Run** button (or press `Ctrl+Enter`)
- Wait for success message

### Step 4: Verify
Run this query to confirm:
```sql
SELECT * FROM public.categories;
```

Should return: `(0 rows)` - This is correct! Table is empty but exists.

### Step 5: Restart Server
```bash
# Stop your dev server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🔧 If You Need All Tables

Run this complete script instead:

```sql
-- CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sku VARCHAR(100),
  inventory INTEGER DEFAULT 0,
  image_url TEXT,
  category VARCHAR(255),
  tags TEXT,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CAROUSEL_SLIDES
CREATE TABLE IF NOT EXISTS public.carousel_slides (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price VARCHAR(50),
  image_url TEXT NOT NULL,
  button_link VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id BIGSERIAL PRIMARY KEY,
  customer JSONB,
  items JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  payment JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousel_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON public.categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON public.products FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read" ON public.carousel_slides FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON public.carousel_slides FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read" ON public.orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated create" ON public.orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON public.orders FOR UPDATE USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_carousel_slides_order ON public.carousel_slides(display_order);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
```

---

## ✔️ Verification Checklist

After running the SQL:

- [ ] No error messages in SQL Editor
- [ ] Query shows "Success" message
- [ ] Can run `SELECT * FROM public.categories;` without error
- [ ] Development server restarted
- [ ] Admin panel loads without errors
- [ ] Can add a category in admin panel

---

## 🆘 Still Having Issues?

### Issue: "Table already exists"
✅ This is fine! It means the table was already created. The script won't recreate it.

### Issue: "Permission denied"
❌ Make sure you're logged in as project owner in Supabase

### Issue: Still getting error after restart
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh page (Ctrl+Shift+R)
3. Wait 30 seconds for Supabase cache to refresh
4. Restart dev server again

### Issue: Can't find SQL Editor
1. Go to https://app.supabase.com
2. Click your project
3. Look for "SQL Editor" in left sidebar (under "Development")
4. If not visible, scroll down in sidebar

---

## 📚 Files Provided

- `database-setup.sql` - Complete setup with all tables
- `database-setup-individual.sql` - Individual table creation scripts
- `DATABASE_SETUP_GUIDE.md` - Detailed guide with explanations
- `QUICK_FIX_GUIDE.md` - This file (quick reference)

---

## 🎯 Next Steps

1. ✅ Create tables using SQL
2. ✅ Restart dev server
3. ✅ Test admin panel:
   - Add a category
   - Add a product
   - Add carousel slide
4. ✅ Verify no errors

Done! 🎉

