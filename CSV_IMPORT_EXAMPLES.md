# CSV Import - Examples & Edge Cases

## Basic Examples

### Example 1: Simple Product (Minimal Fields)

```csv
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
"Blue T-Shirt",299,"https://example.com/blue-tshirt.jpg",,,,,,
```

**What happens:**
- Product created with title, price, and image
- All other fields left empty
- Inventory defaults to 0
- No category or tags

---

### Example 2: Complete Product (All Fields)

```csv
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
"Premium Blue T-Shirt",499,"https://example.com/blue-tshirt.jpg","High-quality blue t-shirt made from 100% organic cotton. Comfortable fit, perfect for everyday wear.","BLUE-TS-001",50,"Apparel","tshirt,blue,cotton,organic","Blue T-Shirt - Premium Quality","Premium blue t-shirt made from organic cotton. Perfect for casual wear."
```

**What happens:**
- All fields populated
- Product has complete information
- Appears in search with tags
- SEO optimized

---

### Example 3: Multiple Products

```csv
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
"Red T-Shirt",299,"https://example.com/red-tshirt.jpg","Red cotton t-shirt","RED-TS-001",30,"Apparel","tshirt,red,cotton","Red T-Shirt","Red cotton t-shirt for casual wear"
"Blue T-Shirt",299,"https://example.com/blue-tshirt.jpg","Blue cotton t-shirt","BLUE-TS-001",25,"Apparel","tshirt,blue,cotton","Blue T-Shirt","Blue cotton t-shirt for casual wear"
"Green T-Shirt",299,"https://example.com/green-tshirt.jpg","Green cotton t-shirt","GREEN-TS-001",20,"Apparel","tshirt,green,cotton","Green T-Shirt","Green cotton t-shirt for casual wear"
```

**What happens:**
- 3 products imported
- Each with different color and SKU
- All in same category
- Different inventory levels

---

## Advanced Examples

### Example 4: Products with Commas in Description

```csv
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
"Multi-Color T-Shirt",399,"https://example.com/multi-tshirt.jpg","Available in red, blue, green, and yellow colors. Perfect for any occasion, casual or formal.","MULTI-TS-001",40,"Apparel","tshirt,multicolor,cotton","Multi-Color T-Shirt","Available in multiple colors: red, blue, green, yellow"
```

**Key Point:** Description wrapped in quotes because it contains commas

---

### Example 5: Products with Quotes in Description

```csv
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
"Premium ""Designer"" T-Shirt",599,"https://example.com/designer-tshirt.jpg","This is our ""premium"" designer collection. Customers say ""best quality ever!""","DESIGNER-TS-001",15,"Apparel","tshirt,designer,premium","Premium Designer T-Shirt","Premium designer t-shirt with excellent reviews"
```

**Key Point:** Quotes escaped with double quotes ("")

---

### Example 6: Products with Decimal Prices

```csv
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
"Budget T-Shirt",249.99,"https://example.com/budget-tshirt.jpg","Affordable t-shirt for budget-conscious shoppers","BUDGET-TS-001",100,"Apparel","tshirt,budget,affordable","Budget T-Shirt","Affordable t-shirt under ₹250"
"Premium T-Shirt",499.99,"https://example.com/premium-tshirt.jpg","Premium quality t-shirt with special features","PREMIUM-TS-001",20,"Apparel","tshirt,premium,quality","Premium T-Shirt","Premium quality t-shirt with special features"
```

**Key Point:** Prices can have decimals (e.g., 249.99)

---

### Example 7: Products with Many Tags

```csv
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
"Versatile T-Shirt",349,"https://example.com/versatile-tshirt.jpg","Versatile t-shirt suitable for multiple occasions","VERSATILE-TS-001",35,"Apparel","tshirt,casual,formal,sports,comfortable,breathable,durable,affordable,popular,bestseller","Versatile T-Shirt","Versatile t-shirt for any occasion"
```

**Key Point:** Multiple tags separated by commas (no spaces)

---

### Example 8: Products with Empty Optional Fields

```csv
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
"Simple T-Shirt",299,"https://example.com/simple-tshirt.jpg",,,,"Apparel",,
```

**What happens:**
- Title, price, image_url filled
- Description, sku, tags, seo_title, seo_description left empty
- Category filled
- Inventory defaults to 0

---

### Example 9: Products with Zero Inventory

```csv
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
"Out of Stock T-Shirt",299,"https://example.com/oos-tshirt.jpg","Currently out of stock","OOS-TS-001",0,"Apparel","tshirt,outofstock","Out of Stock T-Shirt","Currently out of stock"
```

**What happens:**
- Product created with 0 inventory
- Can still be viewed but marked as out of stock
- Can be restocked later

---

### Example 10: Products with Special Characters

```csv
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
"T-Shirt & Shorts Set",599,"https://example.com/set.jpg","T-shirt & shorts combo set. Includes: 1 t-shirt, 1 shorts, 1 belt.","SET-001",25,"Apparel","set,combo,tshirt,shorts","T-Shirt & Shorts Set","T-shirt and shorts combo set with belt"
```

**Key Point:** Special characters like & are fine in quoted fields

---

## Real-World Scenarios

### Scenario 1: Clothing Store Inventory

```csv
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
"Classic White T-Shirt",399,"https://example.com/white-tshirt.jpg","Timeless white t-shirt, perfect for any wardrobe","WHITE-TS-001",100,"Apparel","tshirt,white,classic,casual","White T-Shirt - Classic","Classic white t-shirt for everyday wear"
"Black Jeans",799,"https://example.com/black-jeans.jpg","Comfortable black jeans with perfect fit","BLACK-JN-001",50,"Apparel","jeans,black,casual,denim","Black Jeans - Comfortable Fit","Black jeans with comfortable fit"
"Blue Hoodie",999,"https://example.com/blue-hoodie.jpg","Cozy blue hoodie for cold weather","BLUE-HD-001",30,"Apparel","hoodie,blue,warm,casual","Blue Hoodie - Cozy & Warm","Cozy blue hoodie perfect for winter"
"Red Sneakers",1299,"https://example.com/red-sneakers.jpg","Stylish red sneakers for sports and casual wear","RED-SN-001",25,"Footwear","sneakers,red,sports,casual","Red Sneakers - Stylish","Stylish red sneakers for any occasion"
"Black Belt",299,"https://example.com/black-belt.jpg","Classic black leather belt","BLACK-BT-001",75,"Accessories","belt,black,leather,classic","Black Belt - Classic","Classic black leather belt"
```

---

### Scenario 2: Electronics Store

```csv
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
"Wireless Headphones",2999,"https://example.com/headphones.jpg","High-quality wireless headphones with noise cancellation","WH-001",20,"Electronics","headphones,wireless,audio,noise-cancellation","Wireless Headphones - Premium","Premium wireless headphones with noise cancellation"
"USB-C Cable",299,"https://example.com/usb-c-cable.jpg","Durable USB-C charging cable, 2 meters long","CABLE-001",100,"Accessories","cable,usb-c,charging,durable","USB-C Cable - Durable","Durable 2-meter USB-C charging cable"
"Phone Case",499,"https://example.com/phone-case.jpg","Protective phone case with shock absorption","CASE-001",50,"Accessories","case,phone,protection,shock-absorption","Phone Case - Protective","Protective phone case with shock absorption"
```

---

### Scenario 3: Mixed Categories

```csv
title,price,image_url,description,sku,inventory,category,tags,seo_title,seo_description
"Yoga Mat",799,"https://example.com/yoga-mat.jpg","Non-slip yoga mat for comfortable practice","YOGA-001",30,"Sports","yoga,mat,fitness,exercise","Yoga Mat - Non-Slip","Non-slip yoga mat for comfortable practice"
"Water Bottle",399,"https://example.com/water-bottle.jpg","Insulated water bottle keeps drinks cold for 24 hours","BOTTLE-001",50,"Accessories","bottle,water,insulated,eco-friendly","Water Bottle - Insulated","Insulated water bottle for outdoor activities"
"Running Shoes",1999,"https://example.com/running-shoes.jpg","Professional running shoes with cushioned sole","SHOES-001",25,"Footwear","shoes,running,sports,professional","Running Shoes - Professional","Professional running shoes with cushioned sole"
```

---

## Edge Cases & Gotchas

### Gotcha 1: Spaces Around Commas

❌ **Wrong:**
```
title , price , image_url
```

✅ **Correct:**
```
title,price,image_url
```

---

### Gotcha 2: Missing Image URL

❌ **Wrong:**
```
"Product Name",299,
```

✅ **Correct:**
```
"Product Name",299,"https://example.com/image.jpg"
```

---

### Gotcha 3: Price as Text

❌ **Wrong:**
```
"Product Name","₹299","https://example.com/image.jpg"
```

✅ **Correct:**
```
"Product Name",299,"https://example.com/image.jpg"
```

---

### Gotcha 4: Line Breaks in Fields

❌ **Wrong:**
```
"Product Name",299,"https://example.com/image.jpg","Description
with line break"
```

✅ **Correct:**
```
"Product Name",299,"https://example.com/image.jpg","Description with line break"
```

---

### Gotcha 5: Inconsistent Column Count

❌ **Wrong:**
```
title,price,image_url,description,sku
"Product 1",299,"https://example.com/image.jpg","Description"
"Product 2",399,"https://example.com/image.jpg"
```

✅ **Correct:**
```
title,price,image_url,description,sku
"Product 1",299,"https://example.com/image.jpg","Description","SKU-001"
"Product 2",399,"https://example.com/image.jpg","Description","SKU-002"
```

---

## Testing Your CSV

### Before Importing

1. **Open in text editor** - Verify format looks correct
2. **Check headers** - Ensure first row has correct headers
3. **Check required fields** - Verify title, price, image_url filled
4. **Test image URLs** - Open each URL in browser
5. **Count columns** - Ensure all rows have same number of columns

### Test Import

1. **Start with 1-2 products** - Test the format
2. **Check results** - Verify products imported correctly
3. **Check images** - Verify images display
4. **Check details** - Verify all fields populated correctly
5. **Then import full file** - Once format verified

---

## Performance Tips

- **Batch size:** Import 100-500 products at a time
- **Image URLs:** Pre-upload images to Supabase Storage
- **Testing:** Test with small file first
- **Backup:** Export existing products before importing

---

**Ready to import? Use the template and examples above!** 🚀

