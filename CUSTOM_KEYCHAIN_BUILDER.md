# Custom Keychain Builder - Implementation Guide

## Overview
The Custom Keychain Builder is a new feature that allows customers to design and customize their own keychains with three different options: Name Keychains, Number Plate Keychains, and Pet Tag Keychains.

## Features

### 1. Three Keychain Customization Options

#### Option 1: Custom Name Keychain
- **Purpose:** Personalized keychains with custom names
- **Input:** Text field for name entry
- **Character Limit:** 15 characters max
- **Preview:** Shows the entered name in large text with color selection
- **Price:** ₹299

#### Option 2: Custom Number Plate Keychain
- **Purpose:** Vehicle-style number plate keychains
- **Input:** Alphanumeric text field
- **Character Limit:** 10 characters max
- **Format:** Automatically converts to uppercase
- **Validation:** Only allows letters, numbers, spaces, and hyphens
- **Preview:** Shows number plate with golden background and black border
- **Price:** ₹349

#### Option 3: Custom Pet Tag Keychain
- **Purpose:** Pet identification tags with contact information
- **Inputs:** 
  - Pet Name (required or optional with phone)
  - Phone Number (optional)
- **Character Limits:**
  - Pet Name: 12 characters max
  - Phone Number: 10 characters max
- **Validation:** Phone number accepts only numbers, spaces, hyphens, and +
- **Preview:** Shows circular pet tag with pet name and phone number
- **Price:** ₹399

### 2. User Interface Features

#### Type Selector
- Three clickable cards to select keychain type
- Icons for visual identification (✏️ for name, 🚗 for plate, 🐾 for pet)
- Active state highlighting with gradient background
- Hover effects with smooth transitions

#### Customization Form
- Color selection dropdown (8 colors available)
- Dynamic input fields based on selected keychain type
- Character counters showing remaining characters
- Real-time validation feedback
- Error messages for invalid input

#### Live Preview
- Updates in real-time as user types
- Shows placeholder text when no input provided
- Different preview styles for each keychain type:
  - Name: Large text with color label
  - Number Plate: Golden background with black border
  - Pet Tag: Circular tag with gradient background

#### Purchase Section
- Price display based on keychain type
- "Add to Cart" button (disabled until valid input)
- Success feedback when added to cart

### 3. Form Validation

**Name Keychain:**
- Name must not be empty
- Maximum 15 characters

**Number Plate Keychain:**
- Plate must not be empty
- Maximum 10 characters
- Only alphanumeric characters, spaces, and hyphens allowed

**Pet Tag Keychain:**
- At least pet name OR phone number required
- Pet name: max 12 characters
- Phone number: max 10 characters, only numbers/spaces/hyphens/+

### 4. Color Options
Available for all keychain types:
- Black
- White
- Red
- Blue
- Green
- Yellow
- Purple
- Orange

## File Structure

```
app/
├── custom-keychain/
│   └── page.jsx                    # Server component for route
components/
├── CustomKeychainBuilder.jsx       # Main builder component
app/
└── globals.css                     # Styling (added at end)
```

## Component Details

### CustomKeychainBuilder.jsx

**State Management:**
- `selectedType`: Currently selected keychain type
- `nameInput`: Name keychain text input
- `plateInput`: Number plate text input
- `petName`: Pet tag name input
- `petPhone`: Pet tag phone input
- `color`: Selected color for keychain
- `addedToCart`: Success feedback state
- `error`: Validation error message

**Key Functions:**
- `getValidationError()`: Validates form based on selected type
- `handleAddToCart()`: Adds customized keychain to cart
- `isFormValid()`: Checks if form is ready for submission

**Cart Integration:**
- Uses `addToCart()` from `lib/cart`
- Passes custom product object with:
  - Unique ID with timestamp
  - Custom title based on type
  - Price based on type
  - Customization data (text, color, etc.)
  - `isCustom: true` flag

## Styling

### CSS Classes
- `.custom-keychain-builder`: Main container
- `.builder-header`: Header section
- `.keychain-types`: Type selector grid
- `.type-card`: Individual type option
- `.builder-content`: Two-column layout
- `.form-section`: Left column with form
- `.preview-section`: Right column with preview
- `.preview-box`: Preview display area
- `.purchase-section`: Price and button area

### Responsive Breakpoints
- **Desktop:** Two-column layout (form + preview side by side)
- **Tablet/Mobile:** Single column layout (form above preview)
- **Mobile:** Adjusted font sizes and spacing

## Integration Points

### Navigation
- Added link in `components/Navbar.jsx`
- Added link in `components/MobileMenu.jsx`
- Updated home page featured items in `app/page.jsx`

### Cart System
- Integrates with existing `addToCart()` function
- Custom products stored with `isCustom: true` flag
- Customization data preserved in cart

### Routing
- New route: `/custom-keychain`
- Accessible from navigation menu
- Linked from home page featured items

## Usage

### For Customers
1. Navigate to `/custom-keychain` or click "Custom Keychain" in menu
2. Select keychain type (Name, Number Plate, or Pet Tag)
3. Choose color from dropdown
4. Enter custom text/information
5. Review live preview
6. Click "Add to Cart" when satisfied
7. Proceed to checkout

### For Developers

**To add new keychain type:**
1. Add new type constant to `KEYCHAIN_TYPES`
2. Add price to `PRICES` object
3. Add validation logic in `getValidationError()`
4. Add input fields in JSX
5. Add preview component
6. Add CSS styling

**To modify colors:**
Edit the color options in the select element:
```jsx
<select id="color-select" value={color} onChange={(e) => setColor(e.target.value)}>
  <option>Black</option>
  <option>White</option>
  {/* Add more colors here */}
</select>
```

**To change prices:**
Update the `PRICES` object:
```javascript
const PRICES = {
  name: 299,           // Change this
  number_plate: 349,   // Change this
  pet_tag: 399         // Change this
};
```

## Testing Checklist

- [ ] Navigate to `/custom-keychain` page
- [ ] Verify all three keychain type cards display
- [ ] Click each type and verify form changes
- [ ] Test Name Keychain:
  - [ ] Enter name and verify preview updates
  - [ ] Test character limit (15 chars)
  - [ ] Verify error when empty
  - [ ] Test Add to Cart
- [ ] Test Number Plate Keychain:
  - [ ] Enter plate and verify uppercase conversion
  - [ ] Test character limit (10 chars)
  - [ ] Test special character validation
  - [ ] Verify preview shows golden plate
  - [ ] Test Add to Cart
- [ ] Test Pet Tag Keychain:
  - [ ] Enter pet name and verify preview
  - [ ] Enter phone number and verify preview
  - [ ] Test character limits
  - [ ] Verify error when both empty
  - [ ] Test Add to Cart
- [ ] Test color selection for all types
- [ ] Test responsive design on mobile/tablet
- [ ] Verify cart integration works
- [ ] Test navigation links

## Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations
- Component uses React hooks for state management
- No external API calls (all client-side)
- Lightweight CSS with no animations on critical path
- Optimized for mobile with minimal re-renders

## Future Enhancements
- Add more keychain types (QR code, photo, etc.)
- Material selection (plastic, metal, wood)
- Quantity selector
- Bulk order discounts
- Design templates/presets
- Image upload for custom designs
- Order history and reorder functionality

