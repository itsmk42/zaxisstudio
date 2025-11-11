# CSV Import - Complete Solution

## 🎯 Overview

The Zaxis Studio admin panel supports **bulk product imports via CSV files**. This complete solution includes everything you need to import multiple products at once.

---

## 📦 What's Included

### Files Created

1. **products_import_template.csv** - Ready-to-use CSV template with 10 sample products
2. **CSV_IMPORT_GUIDE.md** - Comprehensive guide with all details
3. **CSV_IMPORT_QUICK_REFERENCE.md** - Quick reference card
4. **CSV_IMPORT_EXAMPLES.md** - Real-world examples and edge cases
5. **CSV_IMPORT_COMPLETE_GUIDE.md** - This file

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Download Template
```
File: products_import_template.csv
Location: Project root directory
```

### Step 2: Edit Template
- Open in Excel, Google Sheets, or text editor
- Replace sample data with your products
- Keep the header row unchanged

### Step 3: Prepare Image URLs
- Upload images via Admin Panel → Products → "Upload Images"
- Or upload to Supabase Storage directly
- Copy the public URLs

### Step 4: Fill CSV Data
- Title: Product name (required)
- Price: Price in rupees (required)
- Image URL: Full HTTPS URL (required)
- Other fields: Optional

### Step 5: Import
1. Go to Admin Panel → Products
2. Click "Import CSV" button
3. Select your CSV file
4. Wait for success message

### Step 6: Verify
- Check products appear in list
- Verify images display
- Check details are correct

---

## 📋 CSV Format

### Header Row (Required)
```
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
```

### Required Fields
- **title** - Product name (text, max 255 chars)
- **price** - Price in rupees (number, non-negative)
- **image_url** - Full HTTPS image URL (must be publicly accessible)

### Optional Fields
- **description** - Product description (text, max 1000 chars)
- **sku** - Stock Keeping Unit (text, max 50 chars)
- **inventory** - Stock quantity (number, defaults to 0)
- **category** - Product category (text, max 100 chars)
- **tags** - Comma-separated tags (text)
- **seo_title** - SEO title (text, max 60 chars)
- **seo_description** - SEO description (text, max 160 chars)

---

## 📝 Example CSV

### Minimal (Only Required Fields)
```csv
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
"Product 1",499,"https://example.com/image1.jpg",,,,,,
"Product 2",799,"https://example.com/image2.jpg",,,,,,
```

### Complete (All Fields)
```csv
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
"Classic Teal T-Shirt",499,"https://example.com/teal-tshirt.jpg","Premium quality teal t-shirt made from 100% cotton.","TEAL-TS-001",50,"Apparel","tshirt,casual,cotton,teal","Teal T-Shirt - Premium","High-quality teal t-shirt for casual wear."
"Cyan Hoodie",799,"https://example.com/cyan-hoodie.jpg","Cozy cyan hoodie with kangaroo pocket.","CYAN-HD-001",30,"Apparel","hoodie,casual,cyan,warm","Cyan Hoodie - Cozy","Comfortable cyan hoodie ideal for winter."
```

---

## 🖼️ Image URLs

### Getting Image URLs

**Option 1: Upload via Admin Panel (Recommended)**
1. Go to Admin Panel → Products
2. Click "Upload Images" file input
3. Select a square image (1:1 aspect ratio)
4. Wait for "✓ Image uploaded" message
5. Copy URL from "Primary Image URL" field

**Option 2: Upload to Supabase Storage**
1. Go to Supabase Dashboard
2. Click Storage → public_files bucket
3. Click products folder
4. Upload image
5. Copy public URL

**Option 3: Use External URLs**
- Any publicly accessible HTTPS URL works
- Example: `https://example.com/image.jpg`

### URL Format
```
https://lpbvjfuyhrjddmgrrped.supabase.co/storage/v1/object/public/public_files/products/filename.jpg
```

---

## ✅ Validation Rules

### Required Fields Must Be Filled
- ❌ Empty title → Product fails
- ❌ Invalid price (not a number) → Product fails
- ❌ Empty image_url → Product fails

### Optional Fields Can Be Empty
- ✅ Empty description → Defaults to empty
- ✅ Empty sku → Defaults to empty
- ✅ Empty inventory → Defaults to 0
- ✅ Empty category → Defaults to empty

### Data Type Validation
- **title** - Must be text
- **price** - Must be a valid number (can be decimal)
- **image_url** - Must be valid HTTPS URL
- **inventory** - Must be whole number (no decimals)

---

## 🔧 Creating CSV Files

### Using Excel
1. Create new spreadsheet
2. Add headers in first row
3. Fill product data starting from row 2
4. File → Save As → Format: CSV (Comma delimited)

### Using Google Sheets
1. Create new spreadsheet
2. Add headers and data
3. File → Download → Comma Separated Values (.csv)

### Using Text Editor
1. Open Notepad/VS Code
2. Type header row
3. Add product rows (one per line)
4. Save as `.csv` file

---

## 📥 Import Process

### Step-by-Step

1. **Prepare CSV file** with your product data
2. **Go to Admin Panel** - http://localhost:3000/admin
3. **Click Products tab**
4. **Click "Import CSV" button** in toolbar
5. **Select your CSV file**
6. **Wait for import** - System processes each row
7. **Check results** - See "Import complete — X ok, Y failed"
8. **Verify products** - Check they appear in list with correct images

### Import Status Messages

| Message | Meaning |
|---------|---------|
| "Import complete — 10 ok, 0 failed" | ✅ All products imported |
| "Import complete — 8 ok, 2 failed" | ⚠️ Some failed - check data |
| "Import complete — 0 ok, 10 failed" | ❌ All failed - check format |

---

## ⚠️ Common Issues & Solutions

### Issue: All Products Failed
**Cause:** Missing required fields or invalid format
**Solution:**
1. Check CSV has correct headers
2. Verify title, price, image_url are filled
3. Verify price is a valid number
4. Verify image URLs are correct

### Issue: Some Products Failed
**Cause:** Some rows have invalid data
**Solution:**
1. Check failed rows for missing data
2. Verify image URLs are accessible
3. Verify prices are valid numbers
4. Re-import corrected rows

### Issue: Image Not Displaying
**Cause:** Invalid or inaccessible image URL
**Solution:**
1. Test URL by opening in browser
2. Verify URL is correct
3. Re-upload image and get correct URL
4. Update product with correct URL

### Issue: CSV File Not Accepted
**Cause:** File format issue
**Solution:**
1. Verify file extension is `.csv`
2. Verify file is valid CSV format
3. Try opening in text editor to check
4. Re-save as CSV format

---

## 📊 Field Reference

| Field | Required | Type | Max Length | Example |
|-------|----------|------|-----------|---------|
| title | ✅ | Text | 255 | "Classic Teal T-Shirt" |
| price | ✅ | Number | - | 499 or 499.99 |
| image_url | ✅ | URL | - | "https://example.com/image.jpg" |
| description | ❌ | Text | 1000 | "Premium quality..." |
| sku | ❌ | Text | 50 | "TEAL-TS-001" |
| inventory | ❌ | Number | - | 50 |
| category | ❌ | Text | 100 | "Apparel" |
| tags | ❌ | Text | - | "tshirt,casual,cotton" |
| seo_title | ❌ | Text | 60 | "Teal T-Shirt - Premium" |
| seo_description | ❌ | Text | 160 | "High-quality teal t-shirt..." |

---

## 💡 Best Practices

### Before Importing
✅ Validate all data in CSV
✅ Test image URLs (open in browser)
✅ Use consistent formatting
✅ Backup existing products (export first)
✅ Start with small test (2-3 products)

### CSV Preparation
✅ Use the template file
✅ Keep headers unchanged
✅ Don't add extra columns
✅ Save as UTF-8 encoding
✅ Check for typos

### After Importing
✅ Verify products appear
✅ Check images display
✅ Review product details
✅ Test on products page
✅ Edit if corrections needed

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **products_import_template.csv** | Ready-to-use template with sample data |
| **CSV_IMPORT_GUIDE.md** | Comprehensive guide with all details |
| **CSV_IMPORT_QUICK_REFERENCE.md** | Quick reference card |
| **CSV_IMPORT_EXAMPLES.md** | Real-world examples and edge cases |
| **CSV_IMPORT_COMPLETE_GUIDE.md** | This file |

---

## 🎯 Next Steps

1. **Download template** - `products_import_template.csv`
2. **Edit with your data** - Fill in your products
3. **Prepare image URLs** - Upload images and get URLs
4. **Test import** - Start with 2-3 products
5. **Verify results** - Check products appear correctly
6. **Import full file** - Once format verified
7. **Check products page** - Verify images display

---

## 🔗 Related Resources

- **Admin Panel:** http://localhost:3000/admin
- **Products Page:** http://localhost:3000/products
- **Supabase Dashboard:** https://app.supabase.com
- **Image Upload Guide:** IMAGE_UPLOAD_GUIDE.md

---

## ✨ Summary

| Aspect | Details |
|--------|---------|
| **Required Fields** | title, price, image_url |
| **Optional Fields** | description, sku, inventory, category, tags, seo_title, seo_description |
| **File Format** | CSV (Comma Separated Values) |
| **Encoding** | UTF-8 |
| **Max File Size** | No hard limit (keep under 10MB) |
| **Import Speed** | ~1-2 seconds per product |
| **Success Message** | "Import complete — X ok, Y failed" |

---

## 🚀 Ready to Import?

1. ✅ Download template: `products_import_template.csv`
2. ✅ Fill with your product data
3. ✅ Prepare image URLs
4. ✅ Go to Admin Panel → Products
5. ✅ Click "Import CSV"
6. ✅ Select your file
7. ✅ Done! 🎉

---

**For detailed information, see the other CSV import documentation files.**

