"use client";
import { useState } from 'react';
import { addToCart } from '../lib/cart';

const KEYCHAIN_TYPES = {
  NAME: 'name',
  NUMBER_PLATE: 'number_plate',
  PET_TAG: 'pet_tag'
};

const PRICES = {
  name: 299,
  number_plate: 349,
  pet_tag: 399
};

export default function CustomKeychainBuilder() {
  const [selectedType, setSelectedType] = useState(KEYCHAIN_TYPES.NAME);
  const [nameInput, setNameInput] = useState('');
  const [plateInput, setPlateInput] = useState('');
  const [petName, setPetName] = useState('');
  const [petPhone, setPetPhone] = useState('');
  const [color, setColor] = useState('Black');
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState('');

  const MAX_NAME_CHARS = 15;
  const MAX_PLATE_CHARS = 10;
  const MAX_PET_NAME_CHARS = 12;
  const MAX_PHONE_CHARS = 10;

  const getValidationError = () => {
    setError('');
    
    if (selectedType === KEYCHAIN_TYPES.NAME) {
      if (!nameInput.trim()) {
        setError('Please enter a name');
        return false;
      }
      if (nameInput.length > MAX_NAME_CHARS) {
        setError(`Name must be ${MAX_NAME_CHARS} characters or less`);
        return false;
      }
    } else if (selectedType === KEYCHAIN_TYPES.NUMBER_PLATE) {
      if (!plateInput.trim()) {
        setError('Please enter a number plate');
        return false;
      }
      if (plateInput.length > MAX_PLATE_CHARS) {
        setError(`Number plate must be ${MAX_PLATE_CHARS} characters or less`);
        return false;
      }
      if (!/^[A-Z0-9\s-]*$/.test(plateInput.toUpperCase())) {
        setError('Only letters, numbers, spaces, and hyphens allowed');
        return false;
      }
    } else if (selectedType === KEYCHAIN_TYPES.PET_TAG) {
      if (!petName.trim() && !petPhone.trim()) {
        setError('Please enter at least a pet name or phone number');
        return false;
      }
      if (petName.length > MAX_PET_NAME_CHARS) {
        setError(`Pet name must be ${MAX_PET_NAME_CHARS} characters or less`);
        return false;
      }
      if (petPhone && !/^[0-9\s\-\+]*$/.test(petPhone)) {
        setError('Phone number can only contain numbers, spaces, hyphens, and +');
        return false;
      }
      if (petPhone.length > MAX_PHONE_CHARS) {
        setError(`Phone number must be ${MAX_PHONE_CHARS} characters or less`);
        return false;
      }
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!getValidationError()) return;

    const customData = {
      type: selectedType,
      color,
      ...(selectedType === KEYCHAIN_TYPES.NAME && { name: nameInput }),
      ...(selectedType === KEYCHAIN_TYPES.NUMBER_PLATE && { plate: plateInput }),
      ...(selectedType === KEYCHAIN_TYPES.PET_TAG && { petName, petPhone })
    };

    const product = {
      id: `custom-keychain-${selectedType}-${Date.now()}`,
      title: `Custom ${selectedType === KEYCHAIN_TYPES.NAME ? 'Name' : selectedType === KEYCHAIN_TYPES.NUMBER_PLATE ? 'Number Plate' : 'Pet Tag'} Keychain`,
      price: PRICES[selectedType],
      customization: customData,
      isCustom: true
    };

    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const isFormValid = () => {
    if (selectedType === KEYCHAIN_TYPES.NAME) {
      return nameInput.trim().length > 0 && nameInput.length <= MAX_NAME_CHARS;
    } else if (selectedType === KEYCHAIN_TYPES.NUMBER_PLATE) {
      return plateInput.trim().length > 0 && plateInput.length <= MAX_PLATE_CHARS;
    } else if (selectedType === KEYCHAIN_TYPES.PET_TAG) {
      return (petName.trim().length > 0 || petPhone.trim().length > 0) &&
             petName.length <= MAX_PET_NAME_CHARS &&
             petPhone.length <= MAX_PHONE_CHARS;
    }
    return false;
  };

  return (
    <div className="custom-keychain-builder">
      <div className="builder-header">
        <h1>Design Your Custom Keychain</h1>
        <p>Choose a keychain type and personalize it with your custom text</p>
      </div>

      {/* Keychain Type Selector */}
      <div className="keychain-types">
        {[
          { id: KEYCHAIN_TYPES.NAME, label: 'Name Keychain', icon: '✏️' },
          { id: KEYCHAIN_TYPES.NUMBER_PLATE, label: 'Number Plate', icon: '🚗' },
          { id: KEYCHAIN_TYPES.PET_TAG, label: 'Pet Tag', icon: '🐾' }
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
          </button>
        ))}
      </div>

      {/* Customization Form */}
      <div className="builder-content">
        <div className="form-section">
          <h2>Customize Your Keychain</h2>

          {/* Color Selection */}
          <div className="form-group">
            <label htmlFor="color-select">Color</label>
            <select
              id="color-select"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="form-input"
            >
              <option>Black</option>
              <option>White</option>
              <option>Red</option>
              <option>Blue</option>
              <option>Green</option>
              <option>Yellow</option>
              <option>Purple</option>
              <option>Orange</option>
            </select>
          </div>

          {/* Name Keychain Input */}
          {selectedType === KEYCHAIN_TYPES.NAME && (
            <div className="form-group">
              <label htmlFor="name-input">Enter Name</label>
              <input
                id="name-input"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value.slice(0, MAX_NAME_CHARS))}
                placeholder="e.g., Sarah"
                className="form-input"
                maxLength={MAX_NAME_CHARS}
              />
              <div className="char-counter">
                {nameInput.length} / {MAX_NAME_CHARS} characters
              </div>
            </div>
          )}

          {/* Number Plate Input */}
          {selectedType === KEYCHAIN_TYPES.NUMBER_PLATE && (
            <div className="form-group">
              <label htmlFor="plate-input">Enter Number Plate</label>
              <input
                id="plate-input"
                type="text"
                value={plateInput.toUpperCase()}
                onChange={(e) => setPlateInput(e.target.value.slice(0, MAX_PLATE_CHARS))}
                placeholder="e.g., MH-01-AB-1234"
                className="form-input"
                maxLength={MAX_PLATE_CHARS}
              />
              <div className="char-counter">
                {plateInput.length} / {MAX_PLATE_CHARS} characters
              </div>
            </div>
          )}

          {/* Pet Tag Inputs */}
          {selectedType === KEYCHAIN_TYPES.PET_TAG && (
            <>
              <div className="form-group">
                <label htmlFor="pet-name-input">Pet Name</label>
                <input
                  id="pet-name-input"
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value.slice(0, MAX_PET_NAME_CHARS))}
                  placeholder="e.g., Max"
                  className="form-input"
                  maxLength={MAX_PET_NAME_CHARS}
                />
                <div className="char-counter">
                  {petName.length} / {MAX_PET_NAME_CHARS} characters
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pet-phone-input">Phone Number (Optional)</label>
                <input
                  id="pet-phone-input"
                  type="tel"
                  value={petPhone}
                  onChange={(e) => setPetPhone(e.target.value.slice(0, MAX_PHONE_CHARS))}
                  placeholder="e.g., 9876543210"
                  className="form-input"
                  maxLength={MAX_PHONE_CHARS}
                />
                <div className="char-counter">
                  {petPhone.length} / {MAX_PHONE_CHARS} characters
                </div>
              </div>
            </>
          )}

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}
        </div>

        {/* Preview Section */}
        <div className="preview-section">
          <h2>Preview</h2>
          <div className="preview-box">
            {selectedType === KEYCHAIN_TYPES.NAME && (
              <div className="preview-name">
                <div className="preview-text">{nameInput || 'Your Name'}</div>
                <div className="preview-color">{color}</div>
              </div>
            )}

            {selectedType === KEYCHAIN_TYPES.NUMBER_PLATE && (
              <div className="preview-plate">
                <div className="plate-text">{plateInput.toUpperCase() || 'AB-12-CD-1234'}</div>
              </div>
            )}

            {selectedType === KEYCHAIN_TYPES.PET_TAG && (
              <div className="preview-pet-tag">
                <div className="pet-tag-circle">
                  <div className="pet-tag-text">{petName || 'Pet'}</div>
                  {petPhone && <div className="pet-tag-phone">{petPhone}</div>}
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

