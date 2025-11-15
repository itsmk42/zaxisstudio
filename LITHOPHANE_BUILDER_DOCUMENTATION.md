# Custom Lithophane Builder - Complete Documentation

## 🎨 Overview

The custom lithophane builder page (`/custom-lithophane`) allows customers to create beautiful, personalized lithophanes from their favorite photos. The page features two lithophane types with realistic previews and a professional user interface.

---

## ✨ Features Implemented

### **1. Two Lithophane Types**

#### **Keychain Lithophane**
- **Dimensions:** 3cm width × 4cm height
- **Aspect Ratio:** 3:4 (portrait orientation)
- **Material:** High-quality resin
- **Features:** Portable, includes metal ring
- **Price:** ₹499
- **Preview:** Rectangular shape with black border and metal ring indicator

#### **Lithophane with Light**
- **Dimensions:** 10cm width × 15cm height
- **Aspect Ratio:** 2:3 (portrait orientation)
- **Material:** Premium resin with stand
- **Features:** Includes LED backlight stand
- **Price:** ₹899
- **Preview:** Frame design with backlight effect and stand

---

## 🎯 Key Features

### **Image Upload**
- Accepts JPG, PNG, and WebP formats
- Maximum file size: 5MB
- Real-time file validation
- Drag-and-drop support
- Clear error messages for invalid files

### **Frame Color Selection**
- **Black** - Classic, modern look
- **White** - Clean, minimalist
- **Natural Wood** - Warm, organic feel
- **Walnut** - Rich, elegant appearance

### **Real-Time Preview**
- Grayscale effect to simulate lithophane appearance
- Accurate aspect ratio representation
- Professional shadow and lighting effects
- Updates instantly as user customizes

### **Lithophane Details**
- Displays dimensions for selected type
- Shows aspect ratio information
- Lists material and features
- Helps customers understand product

### **Validation & Error Handling**
- File format validation
- File size validation
- Clear error messages
- Form validation before adding to cart

---

## 📊 Technical Implementation

### **Component Structure**

**File:** `components/CustomLithophaneBuilder.jsx`

**State Variables:**
```javascript
const [selectedType, setSelectedType] = useState(LITHOPHANE_TYPES.KEYCHAIN);
const [uploadedImage, setUploadedImage] = useState(null);
const [imagePreview, setImagePreview] = useState(null);
const [frameColor, setFrameColor] = useState('black');
const [addedToCart, setAddedToCart] = useState(false);
const [error, setError] = useState('');
```

**Constants:**
```javascript
const LITHOPHANE_TYPES = {
  KEYCHAIN: 'keychain',
  WITH_LIGHT: 'with_light'
};

const PRICES = {
  keychain: 499,
  with_light: 899
};

const FRAME_COLORS = {
  black: 'Black',
  white: 'White',
  natural: 'Natural Wood',
  walnut: 'Walnut'
};
```

### **Page Structure**

**File:** `app/custom-lithophane/page.jsx`

- Server-side rendered page component
- SEO metadata included
- Imports CustomLithophaneBuilder component
- Responsive section wrapper

---

## 🎨 CSS Styling

### **Main Classes**

**Builder Container:**
- `.custom-lithophane-builder` - Main wrapper
- `.builder-header` - Header section
- `.builder-content` - Two-column layout (form + preview)

**Type Selector:**
- `.lithophane-types` - Grid container
- `.type-card` - Individual type button
- `.type-icon`, `.type-label`, `.type-size` - Card elements

**Form Section:**
- `.form-section` - Form container
- `.image-upload-area` - Upload input area
- `.file-input` - Hidden file input
- `.upload-placeholder` - Upload UI
- `.lithophane-info` - Product details box

**Preview Section:**
- `.preview-section` - Preview container
- `.preview-box` - Preview display area
- `.preview-keychain-lithophane-container` - Keychain preview wrapper
- `.keychain-lithophane-preview` - Keychain preview shape
- `.preview-light-lithophane-container` - Light lithophane wrapper
- `.light-lithophane-preview` - Light lithophane preview
- `.lithophane-frame` - Frame styling
- `.lithophane-stand` - Stand styling

**Image Styling:**
- `.lithophane-image` - Image display
- `.lithophane-placeholder` - Placeholder when no image
- `.grayscale` - Grayscale filter effect

**Purchase Section:**
- `.purchase-section` - Price and button area
- `.price-display` - Price display
- `.price-label`, `.price-value` - Price elements

---

## 📱 Responsive Design

### **Desktop (1024px+)**
- Two-column layout (form + preview side-by-side)
- Full-size previews
- Large font sizes
- Optimal spacing

### **Tablet (768px - 1023px)**
- Single column layout
- Medium preview sizes
- Adjusted font sizes
- Optimized spacing

### **Mobile (< 768px)**
- Single column layout
- Compact previews
- Reduced font sizes
- Touch-friendly buttons
- Optimized spacing

---

## 🔄 Data Flow

### **Cart Data Structure**
```javascript
{
  id: 'custom-lithophane-{type}-{timestamp}',
  title: 'Custom {Type} Lithophane',
  price: {price},
  customization: {
    type: 'keychain' | 'with_light',
    frameColor: 'black' | 'white' | 'natural' | 'walnut',
    imageName: 'filename.jpg',
    imageSize: 1024000,
    uploadedAt: '2025-11-13T10:30:00Z'
  },
  isCustom: true
}
```

---

## ✅ Features Checklist

- [x] Two lithophane types with different dimensions
- [x] Image upload with validation
- [x] Frame color selector
- [x] Real-time preview with grayscale effect
- [x] Keychain lithophane preview (3:4 aspect ratio)
- [x] Light lithophane preview (2:3 aspect ratio)
- [x] Metal ring indicator on keychain
- [x] Stand design on light lithophane
- [x] Lithophane details display
- [x] Price display
- [x] Add to cart functionality
- [x] Form validation
- [x] Error handling
- [x] Responsive design
- [x] Professional styling
- [x] SEO metadata

---

## 🧪 Testing Scenarios

### **Image Upload**
1. ✅ Upload valid JPG image
2. ✅ Upload valid PNG image
3. ✅ Upload valid WebP image
4. ✅ Reject invalid format (GIF, BMP, etc.)
5. ✅ Reject oversized file (> 5MB)
6. ✅ Display error messages clearly

### **Type Selection**
1. ✅ Select keychain type
2. ✅ Select light lithophane type
3. ✅ Preview updates correctly
4. ✅ Details update correctly

### **Frame Color**
1. ✅ Select each frame color
2. ✅ Color displays in preview info
3. ✅ All colors available

### **Preview**
1. ✅ Keychain preview shows 3:4 aspect ratio
2. ✅ Light lithophane shows 2:3 aspect ratio
3. ✅ Grayscale effect applied
4. ✅ Metal ring visible on keychain
5. ✅ Stand visible on light lithophane
6. ✅ Placeholder shows when no image

### **Responsive**
1. ✅ Desktop layout (1024px+)
2. ✅ Tablet layout (768px - 1023px)
3. ✅ Mobile layout (< 768px)
4. ✅ All previews scale properly
5. ✅ Touch-friendly on mobile

### **Add to Cart**
1. ✅ Button disabled without image
2. ✅ Button enabled with valid image
3. ✅ Success message shows
4. ✅ Data saved to cart correctly

---

## 🚀 Performance

- **No External Dependencies** - Pure CSS and React
- **Lightweight** - Minimal JavaScript overhead
- **Smooth Animations** - CSS transitions
- **Optimized Images** - Grayscale filter applied
- **Fast Rendering** - Efficient state updates

---

## 🔮 Future Enhancements

- [ ] Image cropping tool
- [ ] Brightness/contrast adjustment
- [ ] Multiple image layouts
- [ ] Custom text overlay on lithophane
- [ ] 3D preview rotation
- [ ] Print preview
- [ ] Design templates
- [ ] Save designs for later
- [ ] Share designs with friends
- [ ] Batch ordering

---

## 📞 Support

### **For Developers**
- Component: `components/CustomLithophaneBuilder.jsx`
- Page: `app/custom-lithophane/page.jsx`
- Styles: `app/globals.css` (lines 4125-4613)
- Follows same patterns as `CustomKeychainBuilder.jsx`

### **For Customers**
- Visit `/custom-lithophane`
- Select lithophane type
- Upload photo
- Choose frame color
- Preview updates in real-time
- Add to cart when satisfied

---

## 📋 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

---

## 🎓 Usage Guide

### **Step 1: Choose Lithophane Type**
- Click on "Keychain Lithophane" for portable option
- Click on "Lithophane with Light" for larger display option

### **Step 2: Upload Photo**
- Click upload area or drag and drop
- Select JPG, PNG, or WebP image
- Maximum 5MB file size

### **Step 3: Select Frame Color**
- Choose from Black, White, Natural Wood, or Walnut
- Color displays in preview info

### **Step 4: Review Preview**
- See grayscale preview of your lithophane
- Check dimensions and details
- Verify frame color

### **Step 5: Add to Cart**
- Click "Add to Cart" button
- Success message confirms addition
- Proceed to checkout

---

## 📊 Pricing

| Type | Dimensions | Price |
|------|-----------|-------|
| Keychain Lithophane | 3cm × 4cm | ₹499 |
| Lithophane with Light | 10cm × 15cm | ₹899 |

---

**Last Updated:** 2025-11-13
**Version:** 1.0
**Status:** Production Ready ✅

