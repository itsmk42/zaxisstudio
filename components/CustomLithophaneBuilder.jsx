"use client";
import { useState } from 'react';
import { addToCart } from '../lib/cart';

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

export default function CustomLithophaneBuilder() {
  const [selectedType, setSelectedType] = useState(LITHOPHANE_TYPES.KEYCHAIN);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [frameColor, setFrameColor] = useState('black');
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState('');

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

  const getValidationError = () => {
    setError('');
    
    if (!uploadedImage) {
      setError('Please upload an image');
      return false;
    }

    if (!ALLOWED_FORMATS.includes(uploadedImage.type)) {
      setError('Please upload a JPG, PNG, or WebP image');
      return false;
    }

    if (uploadedImage.size > MAX_FILE_SIZE) {
      setError('Image size must be less than 5MB');
      return false;
    }

    return true;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!ALLOWED_FORMATS.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WebP image');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');
    setUploadedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddToCart = () => {
    if (!getValidationError()) return;

    const customData = {
      type: selectedType,
      frameColor,
      imageName: uploadedImage.name,
      imageSize: uploadedImage.size,
      uploadedAt: new Date().toISOString()
    };

    const product = {
      id: `custom-lithophane-${selectedType}-${Date.now()}`,
      title: `Custom ${selectedType === LITHOPHANE_TYPES.KEYCHAIN ? 'Keychain' : 'Lithophane with Light'} Lithophane`,
      price: PRICES[selectedType],
      customization: customData,
      isCustom: true
    };

    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const isFormValid = () => {
    return uploadedImage && ALLOWED_FORMATS.includes(uploadedImage.type) && uploadedImage.size <= MAX_FILE_SIZE;
  };

  return (
    <div className="custom-lithophane-builder">
      <div className="builder-header">
        <h1>Design Your Custom Lithophane</h1>
        <p>Upload a photo and create a beautiful lithophane with backlight effect</p>
      </div>

      {/* Lithophane Type Selector */}
      <div className="lithophane-types">
        {[
          { id: LITHOPHANE_TYPES.KEYCHAIN, label: 'Keychain Lithophane', icon: '🔑', size: '3cm × 4cm' },
          { id: LITHOPHANE_TYPES.WITH_LIGHT, label: 'Lithophane with Light', icon: '💡', size: '10cm × 15cm' }
        ].map(type => (
          <button
            key={type.id}
            className={`type-card ${selectedType === type.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedType(type.id);
              setError('');
            }}
          >
            <span className="type-icon">{type.icon}</span>
            <span className="type-label">{type.label}</span>
            <span className="type-size">{type.size}</span>
          </button>
        ))}
      </div>

      {/* Customization Form */}
      <div className="builder-content">
        <div className="form-section">
          <h2>Customize Your Lithophane</h2>

          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="image-upload">Upload Your Photo</label>
            <div className="image-upload-area">
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className="file-input"
              />
              <div className="upload-placeholder">
                <span className="upload-icon">📸</span>
                <span className="upload-text">
                  {uploadedImage ? uploadedImage.name : 'Click to upload or drag and drop'}
                </span>
                <span className="upload-hint">JPG, PNG, or WebP (Max 5MB)</span>
              </div>
            </div>
          </div>

          {/* Frame Color Selection */}
          <div className="form-group">
            <label htmlFor="frame-color-select">Frame Color</label>
            <select
              id="frame-color-select"
              value={frameColor}
              onChange={(e) => setFrameColor(e.target.value)}
              className="form-input"
            >
              {Object.entries(FRAME_COLORS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Lithophane Info */}
          <div className="lithophane-info">
            <h3>Lithophane Details</h3>
            {selectedType === LITHOPHANE_TYPES.KEYCHAIN ? (
              <ul>
                <li><strong>Dimensions:</strong> 3cm width × 4cm height</li>
                <li><strong>Aspect Ratio:</strong> 3:4 (portrait)</li>
                <li><strong>Material:</strong> High-quality resin</li>
                <li><strong>Features:</strong> Portable, includes metal ring</li>
              </ul>
            ) : (
              <ul>
                <li><strong>Dimensions:</strong> 10cm width × 15cm height</li>
                <li><strong>Aspect Ratio:</strong> 2:3 (portrait)</li>
                <li><strong>Material:</strong> Premium resin with stand</li>
                <li><strong>Features:</strong> Includes LED backlight stand</li>
              </ul>
            )}
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}
        </div>

        {/* Preview Section */}
        <div className="preview-section">
          <h2>Preview</h2>
          <div className="preview-box">
            {selectedType === LITHOPHANE_TYPES.KEYCHAIN ? (
              <div className="preview-keychain-lithophane-container">
                <div className="keychain-lithophane-preview">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Lithophane preview"
                      className="lithophane-image grayscale"
                    />
                  ) : (
                    <div className="lithophane-placeholder">
                      <span>📸</span>
                      <span>Upload image to preview</span>
                    </div>
                  )}
                </div>
                <div className="preview-info">
                  <span className="info-label">Size:</span> 3cm × 4cm
                  <br />
                  <span className="info-label">Frame:</span> {FRAME_COLORS[frameColor]}
                </div>
              </div>
            ) : (
              <div className="preview-light-lithophane-container">
                <div className="light-lithophane-preview">
                  <div className="lithophane-frame">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Lithophane preview"
                        className="lithophane-image grayscale"
                      />
                    ) : (
                      <div className="lithophane-placeholder">
                        <span>📸</span>
                        <span>Upload image to preview</span>
                      </div>
                    )}
                  </div>
                  <div className="lithophane-stand"></div>
                </div>
                <div className="preview-info">
                  <span className="info-label">Size:</span> 10cm × 15cm
                  <br />
                  <span className="info-label">Frame:</span> {FRAME_COLORS[frameColor]}
                  <br />
                  <span className="info-label">Includes:</span> LED backlight stand
                </div>
              </div>
            )}
          </div>

          {/* Price and Add to Cart */}
          <div className="purchase-section">
            <div className="price-display">
              <span className="price-label">Price:</span>
              <span className="price-value">₹{PRICES[selectedType]}</span>
            </div>

            <button
              className={`btn btn-primary ${!isFormValid() ? 'disabled' : ''} ${addedToCart ? 'success' : ''}`}
              onClick={handleAddToCart}
              disabled={!isFormValid()}
            >
              {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

