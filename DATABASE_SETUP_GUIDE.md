# Zaxis Studio Database Setup Guide

## Problem
You're getting the error: **"Could not find the table 'public.categories' in the schema cache"**

This means the `categories` table (and possibly other tables) don't exist in your Supabase database.

---

## Solution Overview

Your application needs 4 main tables:
1. **categories** - Product categories
2. **products** - Product information
3. **carousel_slides** - Homepage carousel images
4. **orders** - Customer orders

---

## Step-by-Step Instructions

### Step 1: Access Supabase SQL Editor

1. Go to **https://app.supabase.com**
2. Login with your account
3. Select your project: **zaxisstudio**
4. In the left sidebar, click **SQL Editor**
5. Click **New Query** (or the "+" button)

### Step 2: Copy and Run the SQL Script

1. Open the file `database-setup.sql` in your project root
2. Copy **ALL** the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)

**Expected Result:** You should see a success message with no errors.

### Step 3: Verify Tables Were Created

Run these verification queries one by one in the SQL Editor:

#### Query 1: Check if all tables exist
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('categories', 'products', 'carousel_slides', 'orders');
```

**Expected Result:** 4 rows showing:
- categories
- products
- carousel_slides
- orders

#### Query 2: Check categories table structure
```sql
SELECT column_name, data_type, is_nullable FROM information_schema.columns 
WHERE table_name = 'categories' ORDER BY ordinal_position;
```

**Expected Result:** Columns should include:
- id (bigint)
- name (character varying)
- description (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

#### Query 3: Check products table structure
```sql
SELECT column_name, data_type, is_nullable FROM information_schema.columns 
WHERE table_name = 'products' ORDER BY ordinal_position;
```

**Expected Result:** Columns should include:
- id, title, description, price, sku, inventory, image_url, category, tags, seo_title, seo_description, created_at, updated_at

#### Query 4: Check carousel_slides table structure
```sql
SELECT column_name, data_type, is_nullable FROM information_schema.columns 
WHERE table_name = 'carousel_slides' ORDER BY ordinal_position;
```

**Expected Result:** Columns should include:
- id, title, price, image_url, button_link, display_order, created_at, updated_at

#### Query 5: Check orders table structure
```sql
SELECT column_name, data_type, is_nullable FROM information_schema.columns 
WHERE table_name = 'orders' ORDER BY ordinal_position;
```

**Expected Result:** Columns should include:
- id, customer, items, status, payment, created_at, updated_at

---

## Table Schemas Explained

### 1. Categories Table
```
id (Primary Key)
name (Unique, Required)
description (Optional)
created_at (Auto-timestamp)
updated_at (Auto-timestamp)
```

**Purpose:** Store product categories for filtering and organization

### 2. Products Table
```
id (Primary Key)
title (Required)
description (Optional)
price (Required, Decimal)
sku (Optional)
inventory (Optional, Default: 0)
image_url (Optional)
category (Optional)
tags (Optional)
seo_title (Optional)
seo_description (Optional)
created_at (Auto-timestamp)
updated_at (Auto-timestamp)
```

**Purpose:** Store all product information

### 3. Carousel Slides Table
```
id (Primary Key)
title (Required)
price (Optional)
image_url (Required)
button_link (Optional)
display_order (Optional, Default: 0)
created_at (Auto-timestamp)
updated_at (Auto-timestamp)
```

**Purpose:** Store homepage carousel slide data

### 4. Orders Table
```
id (Primary Key)
customer (JSONB - stores customer info)
items (JSONB - stores ordered items)
status (Default: 'pending')
payment (JSONB - stores payment info)
created_at (Auto-timestamp)
updated_at (Auto-timestamp)
```

**Purpose:** Store customer orders with flexible JSON structure

---

## Security (Row Level Security - RLS)

All tables have RLS policies enabled:
- **Public Read:** Anyone can view products, carousel slides, and categories
- **Authenticated Write:** Only authenticated users (admin) can create/update/delete

This is configured in the SQL script automatically.

---

## Troubleshooting

### Error: "Table already exists"
- This is fine! The script uses `CREATE TABLE IF NOT EXISTS`
- It won't recreate tables that already exist

### Error: "Permission denied"
- Make sure you're logged in as the project owner
- Check that you have admin access to the Supabase project

### Error: "Column already exists"
- The table exists but might be missing columns
- You may need to manually add missing columns using ALTER TABLE

### Tables created but still getting "table not found" error
- Clear your browser cache
- Restart your Next.js development server: `npm run dev`
- Wait 30 seconds for Supabase schema cache to refresh

---

## Next Steps

1. ✅ Run the SQL script to create tables
2. ✅ Verify tables were created using the verification queries
3. ✅ Restart your development server: `npm run dev`
4. ✅ Go to Admin Panel and test:
   - Add a category
   - Add a product
   - Add a carousel slide
   - Create an order

---

## Quick Reference

| Table | Purpose | Key Columns |
|-------|---------|------------|
| categories | Product categories | id, name, description |
| products | Product info | id, title, price, image_url, category |
| carousel_slides | Homepage carousel | id, title, image_url, display_order |
| orders | Customer orders | id, customer, items, status, payment |

---

## Support

If you encounter issues:
1. Check the error message carefully
2. Verify all tables exist using Query 1
3. Check table structure using Queries 2-5
4. Restart your development server
5. Clear browser cache and reload

For more help, check the Supabase documentation: https://supabase.com/docs

