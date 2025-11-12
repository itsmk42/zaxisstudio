# Database Migration Quick Reference

## All Migration Files in Correct Order

This document lists all database migration files in the `db/` directory with their purposes and contents.

---

## 1️⃣ db/products.sql
**Purpose:** Create the base products table

**Key Columns:**
- id (Primary Key)
- title, description, price, sku, inventory
- image_url, category, tags
- seo_title, seo_description
- created_at, updated_at

**Indexes:** category, created_at, title

**Status:** ✅ Must run first

---

## 2️⃣ db/product_variants.sql
**Purpose:** Create variants table (references products)

**Key Columns:**
- id (Primary Key)
- product_id (Foreign Key → products)
- variant_name, price, stock_quantity, sku
- created_at, updated_at

**Indexes:** product_id, sku

**Dependencies:** Requires products table to exist

**Status:** ✅ Run second

---

## 3️⃣ db/product_specifications.sql
**Purpose:** Create specifications table for custom product specs

**Key Columns:**
- id (Primary Key)
- product_id (Foreign Key → products)
- spec_key, spec_value, display_order
- created_at, updated_at

**Indexes:** product_id, display_order

**Dependencies:** Requires products table to exist

**Status:** ✅ Run third

---

## 4️⃣ db/product_images.sql
**Purpose:** Create images table for multiple product images

**Key Columns:**
- id (Primary Key)
- product_id (Foreign Key → products)
- image_url, display_order, is_primary, alt_text
- created_at, updated_at

**Indexes:** product_id, display_order, is_primary

**Dependencies:** Requires products table to exist

**Status:** ✅ Run fourth

---

## 5️⃣ db/product_variants_add_image.sql
**Purpose:** Add image_url column to product_variants table

**What it adds:**
- image_url column (TEXT)
- Index on image_url for performance
- Comment explaining the column

**Dependencies:** Requires product_variants table to exist

**Status:** ✅ Run fifth

---

## 6️⃣ db/product_variants_add_color.sql
**Purpose:** Add color column to product_variants table

**What it adds:**
- color column (VARCHAR(100))
- Index on color for performance
- Comment explaining the column

**Dependencies:** Requires product_variants table to exist

**Status:** ✅ Run sixth (LAST)

---

## Execution Order Summary

```
1. products.sql
   ↓
2. product_variants.sql (depends on products)
   ↓
3. product_specifications.sql (depends on products)
   ↓
4. product_images.sql (depends on products)
   ↓
5. product_variants_add_image.sql (depends on product_variants)
   ↓
6. product_variants_add_color.sql (depends on product_variants)
```

---

## How to Run in Supabase

1. Go to https://app.supabase.com
2. Select your project (zaxisstudio)
3. Click "SQL Editor" in left sidebar
4. Click "New Query"
5. Copy the SQL from each file in order
6. Paste into the editor
7. Click "Run"
8. Repeat for each file

---

## Verification Commands

After running all migrations, verify success:

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('products', 'product_variants', 'product_specifications', 'product_images')
ORDER BY table_name;

-- Check product_variants has all columns
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'product_variants' 
ORDER BY ordinal_position;
```

---

## File Locations

All files are in the `db/` directory at the project root:

```
zaxisstudio.com/
├── db/
│   ├── products.sql
│   ├── product_variants.sql
│   ├── product_specifications.sql
│   ├── product_images.sql
│   ├── product_variants_add_image.sql
│   └── product_variants_add_color.sql
└── ...
```

---

## Common Issues

**"relation does not exist"**
- You skipped a migration
- Run all migrations in order

**"foreign key violation"**
- You ran product_variants before products
- Run migrations in correct order

**"column already exists"**
- Migration was already run
- Safe to ignore, just continue

**Still getting errors after running migrations**
- Restart your dev server: `npm run dev`
- Clear browser cache
- Wait 30 seconds for Supabase cache to refresh

---

## Next Steps After Migrations

1. ✅ Run all 6 migrations in order
2. ✅ Verify tables exist
3. ✅ Restart dev server
4. ✅ Test admin panel:
   - Create product with variants
   - Add colors and images
   - Add specifications
5. ✅ Test product page:
   - View variants
   - Select variant
   - Verify price updates
   - Verify color displays
   - Verify image changes

