-- Add image_url field to product_variants table
-- This allows each variant to have its own image

ALTER TABLE product_variants
ADD COLUMN image_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN product_variants.image_url IS 'URL of the image for this specific variant. If null, falls back to product primary image.';

-- Create index for faster queries
CREATE INDEX idx_product_variants_image_url ON product_variants(image_url);

