# CSV Import - Quick Reference Card

## 📋 CSV Header (Copy & Paste)

```
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
```

---

## ✅ Required Fields

| Field | Type | Example |
|-------|------|---------|
| **title** | Text | "Classic Teal T-Shirt" |
| **price** | Number | 499 |
| **image_url** | URL | "https://lpbvjfuyhrjddmgrrped.supabase.co/storage/v1/object/public/public_files/products/image.jpg" |

---

## ❌ Optional Fields

| Field | Type | Example |
|-------|------|---------|
| description | Text | "Premium quality t-shirt..." |
| sku | Text | "TEAL-TS-001" |
| inventory | Number | 50 |
| category | Text | "Apparel" |
| tags | Text | "tshirt,casual,cotton,teal" |
| seo_title | Text | "Teal T-Shirt - Premium Cotton" |
| seo_description | Text | "High-quality teal t-shirt..." |

---

## 📝 Example Rows

### Minimal (Only Required)
```
"Product Name",499,"https://example.com/image.jpg",,,,,,
```

### Complete (All Fields)
```
"Classic Teal T-Shirt",499,"https://lpbvjfuyhrjddmgrrped.supabase.co/storage/v1/object/public/public_files/products/teal-tshirt.jpg","Premium quality teal colored t-shirt made from 100% cotton. Comfortable fit for everyday wear.","TEAL-TS-001",50,"Apparel","tshirt,casual,cotton,teal","Teal T-Shirt - Premium Cotton","High-quality teal t-shirt perfect for casual wear. Made from 100% cotton."
```

---

## 🚀 How to Import

1. Go to Admin Panel → Products
2. Click "Import CSV" button
3. Select your CSV file
4. Wait for "Import complete" message
5. Check results

---

## ⚠️ Common Mistakes

| Mistake | Fix |
|---------|-----|
| Missing title | Add product name in title column |
| Price not a number | Use only numbers (e.g., 499, not "₹499") |
| Invalid image URL | Use full HTTPS URL starting with https:// |
| Commas in text | Wrap field in quotes: "Text, with, commas" |
| Empty required field | Fill title, price, and image_url |

---

## 🖼️ Image URL Format

```
https://lpbvjfuyhrjddmgrrped.supabase.co/storage/v1/object/public/public_files/products/filename.jpg
```

**How to get image URL:**
1. Upload image in Admin Panel → Products → "Upload Images"
2. Copy URL from "Primary Image URL" field
3. Use in CSV

---

## 📊 Field Limits

| Field | Max Length |
|-------|-----------|
| title | 255 chars |
| description | 1000 chars |
| sku | 50 chars |
| category | 100 chars |
| seo_title | 60 chars |
| seo_description | 160 chars |

---

## ✨ Tips

✅ Start with the template file: `products_import_template.csv`
✅ Test with 2-3 products first
✅ Verify image URLs work before importing
✅ Use consistent category names
✅ Export existing products first as backup

---

## 🔧 Creating CSV File

### Excel/Google Sheets
1. Create spreadsheet with headers
2. Fill in product data
3. Export as CSV

### Text Editor
1. Open Notepad/VS Code
2. Type header row
3. Add product rows (one per line)
4. Save as `.csv`

---

## 📥 Import Status Messages

| Message | Meaning |
|---------|---------|
| "Import complete — 10 ok, 0 failed" | ✅ All products imported successfully |
| "Import complete — 8 ok, 2 failed" | ⚠️ Some products failed - check data |
| "Import complete — 0 ok, 10 failed" | ❌ All products failed - check format |

---

## 🐛 Troubleshooting

**Problem:** All imports failed
- Check: Required fields (title, price, image_url)
- Check: Price is a valid number
- Check: Image URLs are correct

**Problem:** Some imports failed
- Check: Failed rows for missing data
- Check: Image URLs are accessible
- Check: Prices are valid numbers

**Problem:** Image not displaying
- Check: Image URL is correct
- Check: Image URL is publicly accessible
- Check: Image file exists in storage

---

## 📚 Full Documentation

For detailed information, see: `CSV_IMPORT_GUIDE.md`

---

## 🎯 Quick Checklist

- [ ] CSV file has correct headers
- [ ] All required fields filled (title, price, image_url)
- [ ] Prices are valid numbers
- [ ] Image URLs are correct and accessible
- [ ] No line breaks in fields
- [ ] File saved as `.csv`
- [ ] Ready to import!

---

**Download template:** `products_import_template.csv`
**Full guide:** `CSV_IMPORT_GUIDE.md`

