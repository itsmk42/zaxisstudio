# Zaxis Studio Product Management Database Setup Guide

## Problem
You're getting the error: **"ERROR: 42P01: relation 'product_variants' does not exist"**

This means the product management tables haven't been created in your Supabase database yet.

---

## Solution Overview

Your application needs 4 main product tables:
1. **products** - Base product information
2. **product_variants** - Product variants (size, color, etc.)
3. **product_specifications** - Custom product specifications
4. **product_images** - Multiple images per product

Plus 2 additional columns added to product_variants:
- `image_url` - Image for each variant
- `color` - Color of each variant

---

## Migration Files Location

All migration files are in the `db/` directory:
- `db/products.sql` - Base products table
- `db/product_variants.sql` - Variants table
- `db/product_specifications.sql` - Specifications table
- `db/product_images.sql` - Images table
- `db/product_variants_add_image.sql` - Add image_url column
- `db/product_variants_add_color.sql` - Add color column

---

## Step-by-Step Instructions

### Step 1: Access Supabase SQL Editor

1. Go to **https://app.supabase.com**
2. Login with your account
3. Select your project: **zaxisstudio**
4. In the left sidebar, click **SQL Editor**
5. Click **New Query** (or the "+" button)

### Step 2: Run Migrations in Order

**IMPORTANT:** Run these migrations in the exact order shown below. Each migration depends on the previous one.

#### Migration 1: Create Products Table
Copy and paste this into Supabase SQL Editor and click **Run**:

```sql
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

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS products_title_idx ON public.products(title);
```

#### Migration 2: Create Product Variants Table
Copy and paste this into Supabase SQL Editor and click **Run**:

```sql
CREATE TABLE IF NOT EXISTS public.product_variants (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON public.product_variants(sku);
```

#### Migration 3: Create Product Specifications Table
Copy and paste this into Supabase SQL Editor and click **Run**:

```sql
CREATE TABLE IF NOT EXISTS public.product_specifications (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  spec_key VARCHAR(255) NOT NULL,
  spec_value TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_specifications_product_id ON public.product_specifications(product_id);
CREATE INDEX IF NOT EXISTS idx_product_specifications_display_order ON public.product_specifications(display_order);
```

#### Migration 4: Create Product Images Table
Copy and paste this into Supabase SQL Editor and click **Run**:

```sql
CREATE TABLE IF NOT EXISTS public.product_images (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  alt_text VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_display_order ON public.product_images(display_order);
CREATE INDEX IF NOT EXISTS idx_product_images_is_primary ON public.product_images(is_primary);
```

#### Migration 5: Add Image URL to Product Variants
Copy and paste this into Supabase SQL Editor and click **Run**:

```sql
ALTER TABLE product_variants
ADD COLUMN image_url TEXT;

COMMENT ON COLUMN product_variants.image_url IS 'URL of the image for this specific variant. If null, falls back to product primary image.';

CREATE INDEX idx_product_variants_image_url ON product_variants(image_url);
```

#### Migration 6: Add Color to Product Variants
Copy and paste this into Supabase SQL Editor and click **Run**:

```sql
ALTER TABLE product_variants
ADD COLUMN color VARCHAR(100);

COMMENT ON COLUMN product_variants.color IS 'Color of the variant (e.g., Red, Blue, Green, Black, White, etc.)';

CREATE INDEX idx_product_variants_color ON product_variants(color);
```

---

## Verification

After running all migrations, verify they were successful by running this query in Supabase SQL Editor:

```sql
-- Check if all tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('products', 'product_variants', 'product_specifications', 'product_images')
ORDER BY table_name;
```

**Expected Result:** 4 rows showing:
- product_images
- product_specifications
- product_variants
- products

Then verify the product_variants table has all columns:

```sql
-- Check product_variants columns
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'product_variants'
ORDER BY ordinal_position;
```

**Expected Result:** Should include these columns:
- id (bigint)
- product_id (bigint)
- variant_name (character varying)
- price (numeric)
- stock_quantity (integer)
- sku (character varying)
- image_url (text)
- color (character varying)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

---

## Troubleshooting

### Error: "Table already exists"
- This is fine! The script uses `CREATE TABLE IF NOT EXISTS`
- It won't recreate tables that already exist
- Just continue to the next migration

### Error: "Column already exists"
- The column was already added in a previous run
- This is safe to ignore
- Just continue to the next migration

### Error: "Permission denied"
- Make sure you're logged in as the project owner
- Check that you have admin access to the Supabase project

### Still getting "relation does not exist" error after running migrations
1. Clear your browser cache
2. Restart your Next.js development server: `npm run dev`
3. Wait 30 seconds for Supabase schema cache to refresh
4. Try again

### Error: "Foreign key violation"
- Make sure you ran Migration 1 (products table) first
- All other tables depend on it
- Run migrations in the exact order shown above

---

## Next Steps

1. ✅ Run all 6 migrations in order
2. ✅ Verify tables were created using the verification queries
3. ✅ Restart your development server: `npm run dev`
4. ✅ Go to Admin Panel and test:
   - Create a new product
   - Add variants with colors and images
   - Add specifications
   - Add multiple product images
5. ✅ View the product on the product page
   - Verify variant colors display
   - Verify variant prices display
   - Verify variant images display
   - Verify price updates when variant is selected

---

## Database Schema Summary

### products table
- id (Primary Key)
- title, description, price, sku, inventory
- image_url, category, tags
- seo_title, seo_description
- created_at, updated_at

### product_variants table
- id (Primary Key)
- product_id (Foreign Key → products)
- variant_name, price, stock_quantity, sku
- image_url (variant-specific image)
- color (variant color)
- created_at, updated_at

### product_specifications table
- id (Primary Key)
- product_id (Foreign Key → products)
- spec_key, spec_value, display_order
- created_at, updated_at

### product_images table
- id (Primary Key)
- product_id (Foreign Key → products)
- image_url, display_order, is_primary, alt_text
- created_at, updated_at

---

## Support

If you encounter issues:
1. Check the error message carefully
2. Verify all tables exist using the verification query
3. Check table structure using the column verification query
4. Restart your development server
5. Clear browser cache and reload

For more help, check the Supabase documentation: https://supabase.com/docs

