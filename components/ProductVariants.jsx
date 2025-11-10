"use client";
import { useState } from 'react';

export default function ProductVariants({ onVariantChange = () => {} }) {
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedSize, setSelectedSize] = useState('medium');

  const colors = [
    { id: 'black', name: 'Black', hex: '#000000' },
    { id: 'white', name: 'White', hex: '#FFFFFF' },
    { id: 'blue', name: 'Blue', hex: '#0083B0' },
    { id: 'teal', name: 'Teal', hex: '#0F6B7F' },
  ];

  const sizes = ['Small', 'Medium', 'Large', 'XL'];

  const handleColorChange = (colorId) => {
    setSelectedColor(colorId);
    onVariantChange({ color: colorId, size: selectedSize });
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    onVariantChange({ color: selectedColor, size });
  };

  return (
    <div className="product-variants">
      {/* Color Selection */}
      <div className="variant-group">
        <label className="variant-label">Color</label>
        <div className="color-swatches" role="group" aria-label="Color selection">
          {colors.map((color) => (
            <button
              key={color.id}
              className={`color-swatch ${selectedColor === color.id ? 'active' : ''}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => handleColorChange(color.id)}
              aria-label={`Select ${color.name}`}
              aria-pressed={selectedColor === color.id}
              title={color.name}
            >
              {selectedColor === color.id && <span className="swatch-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="variant-group">
        <label className="variant-label">Size</label>
        <div className="size-pills" role="group" aria-label="Size selection">
          {sizes.map((size) => (
            <button
              key={size}
              className={`size-pill ${selectedSize === size ? 'active' : ''}`}
              onClick={() => handleSizeChange(size)}
              aria-label={`Select ${size}`}
              aria-pressed={selectedSize === size}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

