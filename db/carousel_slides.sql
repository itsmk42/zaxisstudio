-- ============================================================================
-- CAROUSEL_SLIDES TABLE SCHEMA
-- Stores homepage carousel slide information
-- ============================================================================

-- Create the carousel_slides table if it doesn't exist
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

-- Add missing columns if they don't exist
-- This handles cases where the table exists but is missing columns
ALTER TABLE public.carousel_slides
ADD COLUMN IF NOT EXISTS button_link VARCHAR(500);

ALTER TABLE public.carousel_slides
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

ALTER TABLE public.carousel_slides
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Enable Row Level Security
ALTER TABLE public.carousel_slides ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Allow public read access to carousel slides" ON public.carousel_slides;
CREATE POLICY "Allow public read access to carousel slides" ON public.carousel_slides
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage carousel slides" ON public.carousel_slides;
CREATE POLICY "Allow authenticated users to manage carousel slides" ON public.carousel_slides
  FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_carousel_slides_display_order ON public.carousel_slides(display_order);
CREATE INDEX IF NOT EXISTS idx_carousel_slides_created_at ON public.carousel_slides(created_at DESC);

