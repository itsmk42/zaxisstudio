# Product Variants, Specifications & Multi-Image Implementation Guide

## Overview
This document describes the comprehensive restructuring of the admin product creation/editing section with support for product variants, specifications, and multiple images.

## Database Schema Changes

### 1. Product Variants Table (`db/product_variants.sql`)
```sql
CREATE TABLE product_variants (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```
**Purpose**: Store different variants of a product (sizes, colors, materials, etc.)
**Indexes**: product_id, sku

### 2. Product Specifications Table (`db/product_specifications.sql`)
```sql
CREATE TABLE product_specifications (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  spec_key VARCHAR(255) NOT NULL,
  spec_value TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```
**Purpose**: Store custom key-value specifications (Material, Dimensions, Weight, etc.)
**Indexes**: product_id, display_order

### 3. Product Images Table (`db/product_images.sql`)
```sql
CREATE TABLE product_images (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  alt_text VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```
**Purpose**: Store multiple images per product with ordering
**Indexes**: product_id, display_order, is_primary

## Admin Panel Features

### 1. Product Variants Management
- **Add Variant Button**: Dynamically add new variant entries
- **Variant Fields**: 
  - Variant name (e.g., "Red", "Large", "PLA")
  - Price (decimal)
  - Stock quantity (integer)
  - SKU (unique identifier)
- **Delete Variant**: Remove individual variants
- **Display**: Grid layout showing all variants in organized rows

### 2. Product Specifications Management
- **Add Specification Button**: Dynamically add key-value pairs
- **Specification Fields**:
  - Key/Label (e.g., "Material", "Dimensions")
  - Value (e.g., "PLA Plastic", "10x5x3 cm")
- **Delete Specification**: Remove individual specifications
- **Display**: Organized grid with key-value pairs

### 3. Multi-Image Upload System
- **Add Image Button**: Dynamically add image entries
- **Image Fields**:
  - Image URL (text input)
  - Alt text (for accessibility)
  - Primary image checkbox (first image is default)
- **Image Ordering**: Display order numbers (#1, #2, #3, etc.)
- **Delete Image**: Remove individual images
- **Primary Image**: Ensure at least one image is marked as primary

### 4. Auto-Generate SKU
- **Auto-Gen Button**: Next to SKU field
- **Generation Logic**: 
  - Converts product name to uppercase
  - Replaces special characters with hyphens
  - Appends unique 4-digit timestamp suffix
  - Example: "Custom Keychain" → "CUSTOM-KEYCHAIN-1234"
- **Validation**: Checks for existing SKUs in database
- **Manual Override**: Users can edit auto-generated SKU

## API Routes Updates

### POST /api/products (Create Product)
**New Functionality**:
- Accepts `variants` array with variant objects
- Accepts `specifications` array with spec objects
- Accepts `images` array with image objects
- Inserts variants into `product_variants` table
- Inserts specifications into `product_specifications` table
- Inserts images into `product_images` table

### PUT/PATCH /api/products (Update Product)
**New Functionality**:
- Handles variants array (delete old, insert new)
- Handles specifications array (delete old, insert new)
- Handles images array (delete old, insert new)
- Maintains referential integrity with CASCADE deletes

## Frontend Components

### ProductFormSection.jsx
**New State Fields**:
- `variants`: Array of variant objects
- `specifications`: Array of specification objects
- `images`: Array of image objects
- `draggedImageIndex`: For future drag-and-drop support

**New Functions**:
- `generateSKU()`: Auto-generate SKU from product name
- `addVariant()`: Add new variant entry
- `updateVariant()`: Update variant field
- `removeVariant()`: Delete variant
- `addSpecification()`: Add new specification
- `updateSpecification()`: Update specification field
- `removeSpecification()`: Delete specification
- `addImage()`: Add new image entry
- `updateImage()`: Update image field
- `removeImage()`: Delete image
- `moveImage()`: Reorder images (prepared for drag-and-drop)

### AdminDashboardClient.jsx
**Updated State**:
- Added `variants`, `specifications`, `images` to productForm state
- Updated `resetProductForm()` to clear new fields
- Updated `startEditProduct()` to load variants, specs, images

### ProductDetailClient.jsx
**Updated Features**:
- Fetches and displays multiple product images
- Shows specifications from database in accordion
- Supports fallback to demo specifications if none exist
- Properly orders images by display_order

## Data Access Layer

### lib/products.js
**Updated `getProductById(id)`**:
- Fetches product from `products` table
- Fetches related variants from `product_variants` table
- Fetches related specifications from `product_specifications` table
- Fetches related images from `product_images` table
- Returns combined object with all related data
- Graceful fallback if new tables don't exist

## Implementation Steps

### Step 1: Apply Database Migrations
Run these SQL files in Supabase SQL editor:
1. `db/product_variants.sql`
2. `db/product_specifications.sql`
3. `db/product_images.sql`

### Step 2: Deploy Code Changes
All code changes are already implemented:
- Admin form with new sections
- API routes with variant/spec/image handling
- Product detail page with multi-image gallery

### Step 3: Test Functionality
1. Create a new product with variants, specifications, and images
2. Edit an existing product to add variants/specs/images
3. View product detail page to verify display
4. Test auto-generate SKU functionality
5. Test image ordering and primary image selection

## Usage Examples

### Creating a Product with Variants
1. Fill in basic product info (title, price, description)
2. Click "Add Variant" button
3. Enter variant details (name, price, stock, SKU)
4. Repeat for additional variants
5. Submit form

### Adding Specifications
1. Click "Add Specification" button
2. Enter key (e.g., "Material") and value (e.g., "PLA")
3. Repeat for additional specifications
4. Submit form

### Uploading Multiple Images
1. Click "Add Image" button
2. Enter image URL and alt text
3. Check "Primary" checkbox for featured image
4. Repeat for additional images
5. Submit form

## Notes
- All new tables have proper foreign key constraints with CASCADE delete
- Indexes are created for performance optimization
- Graceful fallback to demo data if tables don't exist
- Form validation ensures data integrity
- Images are ordered by display_order field
- At least one image must be marked as primary

