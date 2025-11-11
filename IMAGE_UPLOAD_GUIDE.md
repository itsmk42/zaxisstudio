# Image Upload Implementation Guide

## Overview

The image upload feature has been completely redesigned to properly handle file uploads to Supabase Storage and save the URLs to the database.

## What Was Fixed

### Problem
- Users could select image files in the admin panel
- Files appeared to upload without errors
- But images never appeared on the products page
- The `imageFiles` array was collected but never processed
- Only the manual URL input field was being saved

### Solution
- Created a new `/api/upload` endpoint to handle file uploads to Supabase Storage
- Modified ProductFormSection to automatically upload files when selected
- Updated AdminDashboardClient to use the uploaded image URL
- Enhanced the products API to accept and save all product fields
- Added visual feedback for upload status

---

## How It Works Now

### Step 1: User Selects Image
1. User clicks "Upload Images" file input in admin panel
2. Component validates the image is square (1:1 aspect ratio)
3. Shows preview of the selected image

### Step 2: Automatic Upload
1. After validation, the image is automatically uploaded to Supabase Storage
2. Upload happens in the background while user continues filling the form
3. Visual indicator shows "Uploading..." status
4. Once complete, shows "✓ Image uploaded: filename.jpg"

### Step 3: Image URL Saved
1. The public URL from Supabase Storage is automatically set in the `imageUrl` field
2. User can still manually edit the URL if needed
3. When form is submitted, the URL is saved to the database

### Step 4: Display on Products Page
1. Product is created with the image URL
2. Products page fetches the product data
3. Image displays using the Supabase Storage URL

---

## File Structure

### New Files
- **app/api/upload/route.js** - Handles file uploads to Supabase Storage

### Modified Files
- **components/admin/ProductFormSection.jsx** - Added upload handling
- **components/admin/AdminDashboardClient.jsx** - Updated form submission
- **app/api/products/route.js** - Enhanced to accept all product fields
- **app/globals.css** - Added upload status styles

---

## API Endpoints

### POST /api/upload
Uploads a file to Supabase Storage

**Request:**
```
FormData:
- file: File object (required)
- bucket: Storage bucket name (optional, default: 'public_files')
- folder: Folder path (optional, default: 'products')
```

**Response:**
```json
{
  "success": true,
  "url": "https://lpbvjfuyhrjddmgrrped.supabase.co/storage/v1/object/public/public_files/products/1234567890-abc123.jpg",
  "path": "products/1234567890-abc123.jpg",
  "filename": "1234567890-abc123.jpg"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "File size exceeds 5MB limit"
}
```

### DELETE /api/upload
Deletes a file from Supabase Storage

**Query Parameters:**
- `path`: Storage path of file to delete (required)
- `bucket`: Storage bucket name (optional, default: 'public_files')

---

## Validation Rules

### Image Validation
- **Aspect Ratio:** Must be square (1:1), with 5% tolerance
- **File Type:** Must be an image (image/*)
- **File Size:** Maximum 5MB
- **Format:** Supports JPG, PNG, WebP, GIF, etc.

### Product Validation
- **Title:** Required, non-empty string
- **Price:** Required, non-negative number
- **Image URL:** Required (either uploaded or manual)
- **Category:** Optional but recommended
- **Description:** Optional
- **SKU:** Optional
- **Inventory:** Optional, defaults to 0

---

## Usage Instructions

### For Admin Users

#### Adding a Product with Image Upload

1. **Go to Admin Panel**
   - Navigate to `/admin`
   - Click "Products" tab

2. **Fill Product Details**
   - Enter product name (required)
   - Enter price in rupees (required)
   - Enter description (optional)
   - Enter SKU (optional)
   - Enter inventory quantity (optional)

3. **Upload Image**
   - Click "Upload Images" file input
   - Select a square image (1:1 aspect ratio)
   - Wait for "✓ Image uploaded" message
   - Image URL will be automatically filled

4. **Select Category**
   - Choose from existing categories
   - Or create a new category using "+ New" button

5. **Add SEO Information** (optional)
   - Enter SEO title
   - Enter SEO description
   - Add tags (comma-separated)

6. **Submit**
   - Click "Add Product" button
   - Product will be created with the uploaded image

#### Using Manual URL Instead

If you prefer to use a manual URL:
1. Skip the file upload
2. Paste the image URL in "Primary Image URL" field
3. The URL must be a valid, publicly accessible image link
4. Submit the form

---

## Troubleshooting

### Image Upload Fails

**Error: "File size exceeds 5MB limit"**
- Solution: Compress the image to under 5MB
- Use an image compression tool like TinyPNG or ImageOptim

**Error: "Only image files are allowed"**
- Solution: Make sure you're selecting an image file (JPG, PNG, WebP, etc.)
- Don't select PDF, document, or other file types

**Error: "Product image should be square (1:1 aspect ratio)"**
- Solution: Crop the image to be square (same width and height)
- Use an image editor like Photoshop, GIMP, or online tools

**Error: "Failed to upload image"**
- Solution: Check your internet connection
- Try again in a few seconds
- Check browser console for detailed error message

### Image Not Displaying on Products Page

**Issue: Product created but image shows broken link**
- Solution: Check that the image URL is correct
- Verify the image exists in Supabase Storage
- Try uploading the image again

**Issue: Image URL is empty in database**
- Solution: Make sure to upload an image or provide a manual URL
- The image URL field is now required

---

## Technical Details

### Supabase Storage Configuration

**Bucket:** `public_files`
**Region:** `ap-southeast-1` (Singapore)
**Access:** Public (anyone can read)

### File Naming
- Files are stored with timestamp and random suffix
- Format: `{timestamp}-{random}.{extension}`
- Example: `1699999999-abc123.jpg`

### URL Format
```
https://lpbvjfuyhrjddmgrrped.supabase.co/storage/v1/object/public/public_files/products/{filename}
```

### Database Storage
- Image URL is stored in `products.image_url` column
- Type: TEXT
- Can store any valid URL

---

## Security Considerations

### File Upload Security
- ✅ File type validation (images only)
- ✅ File size limit (5MB max)
- ✅ Unique filename generation (prevents overwrites)
- ✅ Server-side validation (not just client-side)

### Storage Security
- ✅ Public read access (images are public)
- ✅ Authenticated write access (only admin can upload)
- ✅ Row Level Security (RLS) on database

### Best Practices
- Always validate file type and size
- Use unique filenames to prevent collisions
- Store URLs in database, not file contents
- Use CDN for image delivery (Supabase handles this)

---

## Performance Optimization

### Image Optimization Tips
1. **Compress images** before uploading (reduce file size)
2. **Use appropriate format** (JPG for photos, PNG for graphics)
3. **Resize to needed dimensions** (don't upload huge images)
4. **Use WebP format** when possible (better compression)

### Supabase Storage Benefits
- ✅ Global CDN distribution
- ✅ Automatic image optimization
- ✅ Fast delivery worldwide
- ✅ Scalable storage

---

## Testing the Feature

### Manual Testing Steps

1. **Start dev server**
   ```bash
   npm run dev
   ```

2. **Go to admin panel**
   - Navigate to http://localhost:3000/admin
   - Login if required

3. **Add a test product**
   - Fill in product details
   - Upload a square image
   - Wait for upload confirmation
   - Submit the form

4. **Verify on products page**
   - Go to http://localhost:3000/products
   - Check that the product appears
   - Verify the image displays correctly

5. **Check database**
   - Go to Supabase dashboard
   - Check `products` table
   - Verify `image_url` column has the correct URL

6. **Check storage**
   - Go to Supabase Storage
   - Check `public_files` bucket
   - Verify the image file exists in `products` folder

---

## Future Enhancements

Potential improvements for future versions:
- [ ] Multiple image uploads per product
- [ ] Image cropping tool
- [ ] Drag-and-drop upload
- [ ] Image optimization on upload
- [ ] Image gallery/carousel
- [ ] Image alt text management
- [ ] Batch image upload

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Check Supabase dashboard for storage issues
4. Verify database tables exist and have correct schema

