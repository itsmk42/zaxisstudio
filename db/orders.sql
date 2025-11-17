-- ============================================================================
-- ORDERS TABLE SCHEMA
-- Stores customer orders for Zaxis Studio e-commerce platform
-- ============================================================================

-- Create the orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.orders (
  id BIGSERIAL PRIMARY KEY,
  
  -- Order items (JSON array of {id, title, price, quantity, etc.})
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Customer information (JSON object with name, email, phone, address, etc.)
  customer JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Order status: pending, confirmed, shipped, delivered, cancelled
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  
  -- Payment information (JSON object with method, status, transaction_id, etc.)
  payment JSONB NOT NULL DEFAULT '{"method": "COD"}'::jsonb,
  
  -- Custom order data (for custom products like lithophanes, keychains, etc.)
  custom JSONB,
  
  -- Order totals
  total_amount DECIMAL(10, 2),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders USING GIN(customer);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public to insert orders (for checkout)
DROP POLICY IF EXISTS "Allow public to create orders" ON public.orders;
CREATE POLICY "Allow public to create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- RLS Policy: Allow public to read their own orders (if they have order ID)
-- Note: In a real app, you'd want to track user_id and restrict access
DROP POLICY IF EXISTS "Allow public to read orders" ON public.orders;
CREATE POLICY "Allow public to read orders" ON public.orders
  FOR SELECT USING (true);

-- RLS Policy: Allow authenticated users (admins) to update orders
DROP POLICY IF EXISTS "Allow authenticated users to update orders" ON public.orders;
CREATE POLICY "Allow authenticated users to update orders" ON public.orders
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policy: Allow authenticated users (admins) to delete orders
DROP POLICY IF EXISTS "Allow authenticated users to delete orders" ON public.orders;
CREATE POLICY "Allow authenticated users to delete orders" ON public.orders
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these to verify the table was created successfully
-- ============================================================================

-- Check if orders table exists:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_name = 'orders';

-- Check orders table structure:
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns 
-- WHERE table_name = 'orders' ORDER BY ordinal_position;

-- Check RLS policies on orders table:
-- SELECT policyname, permissive, roles, qual, with_check FROM pg_policies 
-- WHERE tablename = 'orders';

-- ============================================================================

