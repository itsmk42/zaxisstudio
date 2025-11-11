-- ============================================================================
-- INDIVIDUAL TABLE CREATION SCRIPTS
-- Use these if you need to create tables one at a time
-- ============================================================================

-- ============================================================================
-- 1. CREATE CATEGORIES TABLE ONLY
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage categories" ON public.categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories(name);

-- ============================================================================
-- 2. CREATE PRODUCTS TABLE ONLY
-- ============================================================================

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

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage products" ON public.products
  FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- ============================================================================
-- 3. CREATE CAROUSEL_SLIDES TABLE ONLY
-- ============================================================================

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

ALTER TABLE public.carousel_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to carousel slides" ON public.carousel_slides
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage carousel slides" ON public.carousel_slides
  FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_carousel_slides_order ON public.carousel_slides(display_order);

-- ============================================================================
-- 4. CREATE ORDERS TABLE ONLY
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id BIGSERIAL PRIMARY KEY,
  customer JSONB,
  items JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  payment JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read orders" ON public.orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update orders" ON public.orders
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ============================================================================
-- QUICK VERIFICATION QUERIES
-- ============================================================================

-- Check if categories table exists and has data:
-- SELECT COUNT(*) as category_count FROM public.categories;

-- Check if products table exists and has data:
-- SELECT COUNT(*) as product_count FROM public.products;

-- Check if carousel_slides table exists and has data:
-- SELECT COUNT(*) as carousel_count FROM public.carousel_slides;

-- Check if orders table exists and has data:
-- SELECT COUNT(*) as order_count FROM public.orders;

-- List all tables in public schema:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

