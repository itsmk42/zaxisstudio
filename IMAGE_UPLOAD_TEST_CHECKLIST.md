# Image Upload Feature - Test Checklist

## Pre-Test Setup

- [ ] Database tables created (categories, products, carousel_slides, orders)
- [ ] Supabase Storage bucket exists (`public_files`)
- [ ] Environment variables configured (.env.local)
- [ ] Development server running (`npm run dev`)
- [ ] Admin panel accessible (`http://localhost:3000/admin`)

---

## Test Case 1: Upload Image via File Input

### Steps
1. [ ] Navigate to Admin Panel → Products tab
2. [ ] Fill in product details:
   - [ ] Name: "Test Product 1"
   - [ ] Price: "199"
   - [ ] Description: "Test product with uploaded image"
3. [ ] Click "Upload Images" file input
4. [ ] Select a square image (1:1 aspect ratio)
5. [ ] Wait for upload to complete
6. [ ] Verify "✓ Image uploaded" message appears
7. [ ] Verify image URL is populated in "Primary Image URL" field
8. [ ] Select a category
9. [ ] Click "Add Product" button
10. [ ] Verify "Product added successfully!" message

### Expected Results
- ✅ Image uploads without errors
- ✅ Upload status shows "Uploading..." then "✓ Image uploaded"
- ✅ Image URL is automatically filled
- ✅ Product is created successfully
- ✅ No error messages in browser console

---

## Test Case 2: Verify Image in Database

### Steps
1. [ ] Go to Supabase Dashboard
2. [ ] Select "zaxisstudio" project
3. [ ] Go to SQL Editor
4. [ ] Run query:
   ```sql
   SELECT id, title, image_url FROM public.products 
   WHERE title = 'Test Product 1' LIMIT 1;
   ```
5. [ ] Verify image_url column contains a valid URL

### Expected Results
- ✅ Product appears in database
- ✅ image_url is not empty
- ✅ image_url starts with "https://lpbvjfuyhrjddmgrrped.supabase.co"
- ✅ image_url contains "/products/" folder path

---

## Test Case 3: Verify Image in Storage

### Steps
1. [ ] Go to Supabase Dashboard
2. [ ] Click "Storage" in left sidebar
3. [ ] Click "public_files" bucket
4. [ ] Navigate to "products" folder
5. [ ] Verify image file exists
6. [ ] Click on the file to view details
7. [ ] Copy the public URL

### Expected Results
- ✅ Image file exists in products folder
- ✅ File has timestamp-random naming format
- ✅ File size is reasonable (not 0 bytes)
- ✅ Public URL is accessible

---

## Test Case 4: Display on Products Page

### Steps
1. [ ] Navigate to Products page (`http://localhost:3000/products`)
2. [ ] Scroll to find "Test Product 1"
3. [ ] Verify product card displays
4. [ ] Verify product image displays correctly
5. [ ] Verify image is not broken/placeholder
6. [ ] Click on product to view details
7. [ ] Verify image displays on product detail page

### Expected Results
- ✅ Product appears in products list
- ✅ Product image displays (not broken link)
- ✅ Image is square (1:1 aspect ratio)
- ✅ Image loads quickly
- ✅ Image displays on detail page

---

## Test Case 5: Manual URL Input

### Steps
1. [ ] Navigate to Admin Panel → Products tab
2. [ ] Fill in product details:
   - [ ] Name: "Test Product 2"
   - [ ] Price: "299"
3. [ ] Skip file upload
4. [ ] Paste a valid image URL in "Primary Image URL" field
   - Example: `https://via.placeholder.com/300x300?text=Test`
5. [ ] Select a category
6. [ ] Click "Add Product" button
7. [ ] Verify product is created

### Expected Results
- ✅ Product created with manual URL
- ✅ Image displays on products page
- ✅ No upload errors

---

## Test Case 6: Invalid Image - Wrong Aspect Ratio

### Steps
1. [ ] Navigate to Admin Panel → Products tab
2. [ ] Click "Upload Images" file input
3. [ ] Select a non-square image (e.g., 16:9 landscape)
4. [ ] Wait for validation

### Expected Results
- ✅ Error message: "Product image should be square (1:1 aspect ratio)"
- ✅ Image is not uploaded
- ✅ Image URL field remains empty
- ✅ Form can still be submitted with manual URL

---

## Test Case 7: Invalid Image - File Too Large

### Steps
1. [ ] Create a test image larger than 5MB
2. [ ] Navigate to Admin Panel → Products tab
3. [ ] Click "Upload Images" file input
4. [ ] Select the large image
5. [ ] Wait for validation

### Expected Results
- ✅ Error message: "File size exceeds 5MB limit"
- ✅ Image is not uploaded
- ✅ Image URL field remains empty

---

## Test Case 8: Invalid Image - Wrong File Type

### Steps
1. [ ] Navigate to Admin Panel → Products tab
2. [ ] Click "Upload Images" file input
3. [ ] Try to select a non-image file (PDF, document, etc.)
4. [ ] Wait for validation

### Expected Results
- ✅ Error message: "Only image files are allowed"
- ✅ File is not uploaded
- ✅ Image URL field remains empty

---

## Test Case 9: Multiple Products with Different Images

### Steps
1. [ ] Create 3 test products with different images
2. [ ] Each with different image files
3. [ ] Verify all images upload successfully
4. [ ] Go to products page
5. [ ] Verify all images display correctly

### Expected Results
- ✅ All products created successfully
- ✅ All images upload without conflicts
- ✅ All images display on products page
- ✅ Each product shows correct image

---

## Test Case 10: Image Upload with Slow Network

### Steps
1. [ ] Open browser DevTools (F12)
2. [ ] Go to Network tab
3. [ ] Set network throttling to "Slow 3G"
4. [ ] Navigate to Admin Panel → Products tab
5. [ ] Upload an image
6. [ ] Observe upload progress

### Expected Results
- ✅ Upload status shows "Uploading..."
- ✅ Upload completes (may take longer)
- ✅ Success message appears
- ✅ No timeout errors

---

## Test Case 11: Form Reset After Submission

### Steps
1. [ ] Add a product with uploaded image
2. [ ] Verify "Product added successfully!" message
3. [ ] Verify form fields are cleared:
   - [ ] Name field is empty
   - [ ] Price field is empty
   - [ ] Image URL field is empty
   - [ ] Image preview is gone
   - [ ] Category is reset

### Expected Results
- ✅ All form fields are cleared
- ✅ Form is ready for next product
- ✅ No residual data from previous submission

---

## Test Case 12: Browser Console - No Errors

### Steps
1. [ ] Open browser DevTools (F12)
2. [ ] Go to Console tab
3. [ ] Upload an image
4. [ ] Submit product form
5. [ ] Check console for errors

### Expected Results
- ✅ No error messages in console
- ✅ No warning messages related to upload
- ✅ No network errors (404, 500, etc.)
- ✅ Upload request shows 200 status

---

## Regression Tests

### Existing Features Still Work
- [ ] Admin login still works
- [ ] Carousel management still works
- [ ] Order management still works
- [ ] Category management still works
- [ ] Product deletion still works
- [ ] Product editing still works
- [ ] CSV import still works

---

## Performance Tests

### Upload Performance
- [ ] Small image (< 1MB) uploads in < 2 seconds
- [ ] Medium image (1-3MB) uploads in < 5 seconds
- [ ] Large image (3-5MB) uploads in < 10 seconds

### Page Load Performance
- [ ] Products page loads in < 2 seconds
- [ ] Product detail page loads in < 2 seconds
- [ ] Admin panel loads in < 2 seconds

---

## Browser Compatibility

Test on multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

Expected: All browsers work identically

---

## Mobile Testing

- [ ] Upload works on mobile devices
- [ ] Image preview displays on mobile
- [ ] Products page displays correctly on mobile
- [ ] Images load on mobile

---

## Final Verification

- [ ] All test cases passed ✅
- [ ] No console errors ✅
- [ ] No database errors ✅
- [ ] Images display correctly ✅
- [ ] Performance is acceptable ✅
- [ ] Ready for production ✅

---

## Notes

Use this space to document any issues found:

```
Issue 1: [Description]
Status: [Open/Fixed]
Notes: [Details]

Issue 2: [Description]
Status: [Open/Fixed]
Notes: [Details]
```

---

## Sign-Off

- Tested by: _______________
- Date: _______________
- Status: ✅ PASSED / ❌ FAILED
- Comments: _______________

