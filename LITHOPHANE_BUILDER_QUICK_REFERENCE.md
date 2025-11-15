# Custom Lithophane Builder - Quick Reference

## 🎯 Quick Overview

Custom lithophane builder at `/custom-lithophane` allows customers to create personalized lithophanes from photos with realistic previews.

---

## 📋 Feature Summary

### Lithophane Types
| Type | Dimensions | Aspect Ratio | Price | Features |
|------|-----------|--------------|-------|----------|
| **Keychain** | 3cm × 4cm | 3:4 | ₹499 | Portable, metal ring |
| **With Light** | 10cm × 15cm | 2:3 | ₹899 | LED stand, display |

### Frame Colors
- Black (classic)
- White (clean)
- Natural Wood (warm)
- Walnut (elegant)

### Image Upload
- **Formats:** JPG, PNG, WebP
- **Max Size:** 5MB
- **Validation:** Real-time
- **Preview:** Grayscale effect

---

## 🔧 Component Reference

### **File Locations**
```
components/CustomLithophaneBuilder.jsx    (Main component)
app/custom-lithophane/page.jsx            (Page wrapper)
app/globals.css                           (Styles: lines 4125-4613)
```

### **State Variables**
```javascript
selectedType          // 'keychain' or 'with_light'
uploadedImage         // File object
imagePreview          // Data URL string
frameColor            // 'black', 'white', 'natural', 'walnut'
addedToCart           // Boolean
error                 // Error message string
```

### **Constants**
```javascript
LITHOPHANE_TYPES = {
  KEYCHAIN: 'keychain',
  WITH_LIGHT: 'with_light'
}

PRICES = {
  keychain: 499,
  with_light: 899
}

FRAME_COLORS = {
  black: 'Black',
  white: 'White',
  natural: 'Natural Wood',
  walnut: 'Walnut'
}
```

---

## 🎨 CSS Classes

### **Main Containers**
```css
.custom-lithophane-builder           /* Main wrapper */
.builder-header                      /* Header section */
.builder-content                     /* Form + preview grid */
```

### **Type Selector**
```css
.lithophane-types                    /* Grid container */
.type-card                           /* Individual button */
.type-card.active                    /* Active state */
.type-icon, .type-label, .type-size  /* Card elements */
```

### **Form Elements**
```css
.form-section                        /* Form container */
.image-upload-area                   /* Upload input */
.file-input                          /* Hidden input */
.upload-placeholder                  /* Upload UI */
.lithophane-info                     /* Details box */
```

### **Preview Elements**
```css
.preview-section                     /* Preview container */
.preview-box                         /* Preview display */
.keychain-lithophane-preview         /* Keychain shape */
.light-lithophane-preview            /* Light lithophane */
.lithophane-frame                    /* Frame styling */
.lithophane-stand                    /* Stand styling */
.lithophane-image                    /* Image display */
.lithophane-placeholder              /* Placeholder */
.grayscale                           /* Grayscale filter */
```

### **Purchase Section**
```css
.purchase-section                    /* Price + button */
.price-display                       /* Price container */
.price-label, .price-value           /* Price elements */
```

---

## 📱 Responsive Breakpoints

### **Desktop (1024px+)**
- Two-column layout
- Full-size previews
- Large fonts

### **Tablet (768px - 1023px)**
- Single column
- Medium previews
- Adjusted fonts

### **Mobile (< 768px)**
- Single column
- Compact previews
- Small fonts
- Touch-friendly

---

## 🔄 Data Structure

### **Cart Item**
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

## ✅ Validation Rules

### **Image Upload**
- ✅ Format: JPG, PNG, WebP only
- ✅ Size: Max 5MB
- ✅ Required: Must upload image
- ✅ Error messages: Clear and specific

### **Form Validation**
- ✅ Image required before add to cart
- ✅ Valid format required
- ✅ File size within limit
- ✅ Button disabled until valid

---

## 🎯 Key Features

✅ **Two Lithophane Types** - Keychain and with light
✅ **Image Upload** - JPG, PNG, WebP support
✅ **Frame Colors** - 4 color options
✅ **Real-Time Preview** - Grayscale effect
✅ **Responsive** - All devices supported
✅ **Validation** - File format and size
✅ **Error Handling** - Clear messages
✅ **Professional UI** - Modern design

---

## 🧪 Testing Checklist

- [ ] Upload valid image
- [ ] Reject invalid format
- [ ] Reject oversized file
- [ ] Select keychain type
- [ ] Select light type
- [ ] Change frame color
- [ ] Preview updates correctly
- [ ] Add to cart works
- [ ] Mobile responsive
- [ ] Tablet responsive
- [ ] Desktop responsive
- [ ] Error messages display
- [ ] Success message shows

---

## 🚀 Performance Notes

- **Bundle Size:** Minimal impact
- **Load Time:** No external dependencies
- **Animations:** Smooth CSS transitions
- **Image Handling:** Efficient preview generation
- **State Updates:** Optimized re-renders

---

## 💡 Developer Tips

1. **Adding Frame Colors:**
   - Add to `FRAME_COLORS` object
   - Update select options
   - Update preview info display

2. **Changing Prices:**
   - Update `PRICES` object
   - Prices in rupees (₹)

3. **Modifying Dimensions:**
   - Update aspect ratios in CSS
   - Update lithophane info display
   - Update preview styling

4. **Adding Image Formats:**
   - Update `ALLOWED_FORMATS` array
   - Update upload hint text
   - Update validation logic

---

## 🔗 Related Files

- `CustomKeychainBuilder.jsx` - Similar pattern
- `app/custom-keychain/page.jsx` - Reference page
- `lib/cart.js` - Cart functionality
- `app/globals.css` - Global styles

---

## 📞 Quick Support

**Page URL:** `/custom-lithophane`

**Component:** `CustomLithophaneBuilder.jsx`

**Styles:** `app/globals.css` (lines 4125-4613)

**Pricing:**
- Keychain: ₹499
- With Light: ₹899

**Image Limits:**
- Formats: JPG, PNG, WebP
- Max Size: 5MB

---

## 🎓 Customer Features

✅ Choose between 2 lithophane types
✅ Upload favorite photo
✅ Select frame color
✅ See real-time preview
✅ Add to cart
✅ Proceed to checkout

---

**Last Updated:** 2025-11-13
**Version:** 1.0
**Status:** Production Ready ✅

