-- ============================================================================
-- ZAXIS STUDIO DATABASE SETUP
-- SQL Script to create all required tables for the e-commerce platform
-- ============================================================================

-- 1. CATEGORIES TABLE
-- Stores product categories
CREATE TABLE IF NOT EXISTS public.categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policy for categories (public read, authenticated write)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage categories" ON public.categories
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================

-- 2. PRODUCTS TABLE
-- Stores product information
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

-- Add RLS policy for products (public read, authenticated write)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage products" ON public.products
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================

-- 3. CAROUSEL_SLIDES TABLE
-- Stores homepage carousel slide information
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

-- Add RLS policy for carousel_slides (public read, authenticated write)
ALTER TABLE public.carousel_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to carousel slides" ON public.carousel_slides
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage carousel slides" ON public.carousel_slides
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================

-- 4. ORDERS TABLE
-- Stores customer orders
CREATE TABLE IF NOT EXISTS public.orders (
  id BIGSERIAL PRIMARY KEY,
  customer JSONB,
  items JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  payment JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policy for orders (authenticated users can see their own orders)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read orders" ON public.orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update orders" ON public.orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================================

-- 5. INDEXES FOR PERFORMANCE
-- Create indexes on frequently queried columns

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_carousel_slides_order ON public.carousel_slides(display_order);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories(name);

-- ============================================================================

-- VERIFICATION QUERIES
-- Run these to verify tables were created successfully

-- Check if all tables exist:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('categories', 'products', 'carousel_slides', 'orders');

-- Check categories table structure:
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns 
-- WHERE table_name = 'categories' ORDER BY ordinal_position;

-- Check products table structure:
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns 
-- WHERE table_name = 'products' ORDER BY ordinal_position;

-- Check carousel_slides table structure:
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns 
-- WHERE table_name = 'carousel_slides' ORDER BY ordinal_position;

-- Check orders table structure:
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns 
-- WHERE table_name = 'orders' ORDER BY ordinal_position;

