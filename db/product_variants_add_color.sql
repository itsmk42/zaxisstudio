-- Add color field to product_variants table
-- This allows each variant to have a color attribute

ALTER TABLE product_variants
ADD COLUMN color VARCHAR(100);

-- Add comment for documentation
COMMENT ON COLUMN product_variants.color IS 'Color of the variant (e.g., Red, Blue, Green, Black, White, etc.)';

-- Create index for faster queries
CREATE INDEX idx_product_variants_color ON product_variants(color);

