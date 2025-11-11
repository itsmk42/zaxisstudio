# CSV Import Guide - Bulk Product Upload

## Overview

The Zaxis Studio admin panel supports bulk product imports via CSV files. This guide explains how to prepare and import your product data.

---

## Quick Start

1. **Download the template:** `products_import_template.csv`
2. **Fill in your product data** using the format specified below
3. **Go to Admin Panel** → Products tab
4. **Click "Import CSV"** button
5. **Select your CSV file**
6. **Wait for import to complete** - You'll see a success/failure message

---

## CSV Format

### Column Headers (Required)

Your CSV file **must** have these column headers in the first row:

```
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
```

**Important:** Headers are case-sensitive and must be in this exact order.

### Column Definitions

| Column | Required | Type | Format | Example |
|--------|----------|------|--------|---------|
| **title** | ✅ YES | Text | Product name (max 255 chars) | "Classic Teal T-Shirt" |
| **price** | ✅ YES | Number | Price in rupees (no currency symbol) | 499 |
| **image_url** | ✅ YES | URL | Full public image URL | "https://lpbvjfuyhrjddmgrrped.supabase.co/storage/v1/object/public/public_files/products/image.jpg" |
| **description** | ❌ NO | Text | Product description (max 1000 chars) | "Premium quality t-shirt..." |
| **sku** | ❌ NO | Text | Stock Keeping Unit (max 50 chars) | "TEAL-TS-001" |
| **inventory** | ❌ NO | Number | Stock quantity (whole number) | 50 |
| **category** | ❌ NO | Text | Product category (max 100 chars) | "Apparel" |
| **tags** | ❌ NO | Text | Comma-separated tags | "tshirt,casual,cotton,teal" |
| **seo_title** | ❌ NO | Text | SEO title (max 60 chars) | "Teal T-Shirt - Premium Cotton" |
| **seo_description** | ❌ NO | Text | SEO description (max 160 chars) | "High-quality teal t-shirt..." |

---

## Field Requirements & Validation

### Required Fields

**title**
- Must not be empty
- Maximum 255 characters
- Cannot contain line breaks
- Example: `"Classic Teal T-Shirt"`

**price**
- Must be a valid number
- Must be non-negative (≥ 0)
- Can be decimal (e.g., 499.99)
- No currency symbol
- Example: `499` or `499.99`

**image_url**
- Must be a valid, publicly accessible URL
- Must start with `https://`
- Should point to an image file
- Example: `"https://lpbvjfuyhrjddmgrrped.supabase.co/storage/v1/object/public/public_files/products/image.jpg"`

### Optional Fields

**description**
- Can be empty (leave blank)
- Maximum 1000 characters
- Can contain multiple sentences
- Example: `"Premium quality teal colored t-shirt made from 100% cotton. Comfortable fit for everyday wear."`

**sku**
- Can be empty (leave blank)
- Maximum 50 characters
- Typically alphanumeric with hyphens
- Example: `"TEAL-TS-001"`

**inventory**
- Can be empty (defaults to 0)
- Must be a whole number (no decimals)
- Example: `50`

**category**
- Can be empty (leave blank)
- Maximum 100 characters
- Example: `"Apparel"` or `"Footwear"`

**tags**
- Can be empty (leave blank)
- Comma-separated values
- No spaces after commas (they will be trimmed)
- Example: `"tshirt,casual,cotton,teal"`

**seo_title**
- Can be empty (leave blank)
- Maximum 60 characters (recommended for Google)
- Example: `"Teal T-Shirt - Premium Cotton"`

**seo_description**
- Can be empty (leave blank)
- Maximum 160 characters (recommended for Google)
- Example: `"High-quality teal t-shirt perfect for casual wear. Made from 100% cotton."`

---

## CSV Format Rules

### Text Fields with Commas

If a field contains commas, **wrap it in double quotes**:

```
"Classic Teal T-Shirt, Premium Quality",499,"https://...",
```

### Text Fields with Quotes

If a field contains quotes, **escape them with double quotes**:

```
"Product with ""special"" features",499,"https://...",
```

### Empty Fields

Leave empty (just commas):

```
"Product Name",499,"https://...",,"SKU-001",50,"Category",,,"SEO Title",
```

### Line Breaks

Do NOT include line breaks in fields. If you need to break text, use a period or semicolon instead.

---

## Image URL Requirements

### Getting Image URLs

**Option 1: Upload via Admin Panel (Recommended)**
1. Go to Admin Panel → Products
2. Click "Upload Images" file input
3. Select a square image (1:1 aspect ratio)
4. Wait for "✓ Image uploaded" message
5. Copy the image URL from the "Primary Image URL" field
6. Use this URL in your CSV

**Option 2: Upload to Supabase Storage Directly**
1. Go to Supabase Dashboard
2. Click "Storage" → "public_files" bucket
3. Click "products" folder
4. Upload your image
5. Click the image file
6. Copy the public URL

**Option 3: Use External URLs**
- Any publicly accessible image URL works
- Must be HTTPS (not HTTP)
- Image must be accessible from anywhere
- Example: `https://example.com/image.jpg`

### Image URL Format

```
https://lpbvjfuyhrjddmgrrped.supabase.co/storage/v1/object/public/public_files/products/filename.jpg
```

---

## Example CSV File

### Minimal Example (Only Required Fields)

```csv
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
"Product 1",499,"https://example.com/image1.jpg",,,,,,
"Product 2",799,"https://example.com/image2.jpg",,,,,,
```

### Complete Example (All Fields)

```csv
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
"Classic Teal T-Shirt",499,"https://lpbvjfuyhrjddmgrrped.supabase.co/storage/v1/object/public/public_files/products/teal-tshirt.jpg","Premium quality teal colored t-shirt made from 100% cotton. Comfortable fit for everyday wear.","TEAL-TS-001",50,"Apparel","tshirt,casual,cotton,teal","Teal T-Shirt - Premium Cotton","High-quality teal t-shirt perfect for casual wear. Made from 100% cotton."
"Cyan Hoodie",799,"https://lpbvjfuyhrjddmgrrped.supabase.co/storage/v1/object/public/public_files/products/cyan-hoodie.jpg","Cozy cyan hoodie with kangaroo pocket. Perfect for cold weather.","CYAN-HD-001",30,"Apparel","hoodie,casual,cyan,warm","Cyan Hoodie - Cozy & Warm","Comfortable cyan hoodie ideal for winter. Features kangaroo pocket."
```

---

## How to Create/Edit CSV Files

### Using Excel/Google Sheets

1. **Create a new spreadsheet**
2. **Add headers** in the first row:
   - A1: title
   - B1: price
   - C1: image_url
   - D1: description
   - E1: sku
   - F1: inventory
   - G1: category
   - H1: tags
   - I1: seo_title
   - J1: seo_description

3. **Fill in your product data** starting from row 2

4. **Export as CSV:**
   - Excel: File → Save As → Format: CSV (Comma delimited)
   - Google Sheets: File → Download → Comma Separated Values (.csv)

### Using Text Editor

1. **Open a text editor** (Notepad, VS Code, etc.)
2. **Type the header row:**
   ```
   title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
   ```
3. **Add product rows** (one per line)
4. **Save as `.csv` file**

### Using the Template

1. **Download:** `products_import_template.csv`
2. **Open in Excel/Google Sheets**
3. **Edit the sample rows** with your product data
4. **Add more rows** as needed
5. **Save as CSV**

---

## Import Process

### Step-by-Step

1. **Go to Admin Panel**
   - Navigate to `http://localhost:3000/admin`
   - Login if required

2. **Go to Products Tab**
   - Click "Products" in the admin menu

3. **Click "Import CSV" Button**
   - Located in the toolbar above the product list

4. **Select Your CSV File**
   - Choose your prepared CSV file
   - Click "Open"

5. **Wait for Import**
   - The system will process each row
   - You'll see a message: "Import complete — X ok, Y failed"

6. **Check Results**
   - Successful imports: Products appear in the list
   - Failed imports: Check the error message
   - Refresh the page if needed

---

## Troubleshooting

### "Import complete — 0 ok, 10 failed"

**Problem:** All products failed to import

**Possible Causes:**
1. Missing required fields (title, price, image_url)
2. Invalid price (not a number)
3. Empty title field
4. Invalid image URL

**Solution:**
1. Check that all required fields are filled
2. Verify price is a valid number
3. Verify image URLs are correct and accessible
4. Try importing one product at a time to identify the issue

### "Import complete — 5 ok, 2 failed"

**Problem:** Some products imported, some failed

**Possible Causes:**
1. Some rows have missing required fields
2. Some image URLs are invalid
3. Some prices are not valid numbers

**Solution:**
1. Check the failed rows in your CSV
2. Verify all required fields are filled
3. Test image URLs by opening them in a browser
4. Re-import the corrected rows

### Image Not Displaying After Import

**Problem:** Product imported but image shows broken link

**Possible Causes:**
1. Image URL is incorrect
2. Image URL is not publicly accessible
3. Image was deleted from storage

**Solution:**
1. Verify the image URL is correct
2. Test the URL by opening it in a browser
3. Re-upload the image and get the correct URL
4. Update the product with the correct image URL

### CSV File Not Accepted

**Problem:** File input doesn't accept the CSV file

**Possible Causes:**
1. File is not actually a CSV file
2. File has wrong extension
3. File is corrupted

**Solution:**
1. Verify file extension is `.csv`
2. Open the file in a text editor to check format
3. Re-save the file as CSV format
4. Try a different file

---

## Best Practices

### Before Importing

1. ✅ **Validate your data** - Check all required fields are filled
2. ✅ **Test image URLs** - Open each URL in a browser
3. ✅ **Use consistent formatting** - Keep prices, SKUs, etc. consistent
4. ✅ **Backup existing data** - Export current products first
5. ✅ **Start small** - Test with 2-3 products first

### CSV File Preparation

1. ✅ **Use the template** - Start with `products_import_template.csv`
2. ✅ **Keep it simple** - Don't add extra columns
3. ✅ **Use proper encoding** - Save as UTF-8
4. ✅ **Check for typos** - Review before importing
5. ✅ **Use consistent categories** - Keep category names consistent

### After Importing

1. ✅ **Verify products** - Check that products appear correctly
2. ✅ **Check images** - Verify all images display
3. ✅ **Review details** - Check descriptions, prices, etc.
4. ✅ **Test on products page** - View products on the public page
5. ✅ **Update if needed** - Edit products in admin panel if corrections needed

---

## Limits & Constraints

### File Size
- Maximum file size: No hard limit, but keep under 10MB for best performance
- Recommended: Under 1000 products per file

### Product Limits
- Maximum products per import: Unlimited (but process one at a time)
- Import speed: ~1-2 seconds per product

### Field Limits
- Title: 255 characters
- Description: 1000 characters
- SKU: 50 characters
- Category: 100 characters
- SEO Title: 60 characters (recommended)
- SEO Description: 160 characters (recommended)

---

## Support

### For Issues

1. Check the troubleshooting section above
2. Verify your CSV format matches the template
3. Test image URLs in a browser
4. Try importing one product at a time
5. Check browser console (F12) for error messages

### For Questions

1. Review this guide
2. Check the template file
3. Review the example CSV files
4. Check the admin panel help

---

## Quick Reference

### CSV Header
```
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
```

### Minimal Row
```
"Product Name",499,"https://example.com/image.jpg",,,,,,
```

### Complete Row
```
"Product Name",499,"https://example.com/image.jpg","Description","SKU-001",50,"Category","tag1,tag2","SEO Title","SEO Description"
```

### Required Fields
- title (non-empty text)
- price (non-negative number)
- image_url (valid HTTPS URL)

### Optional Fields
- description, sku, inventory, category, tags, seo_title, seo_description

---

**Ready to import products? Download the template and get started!** 🚀

