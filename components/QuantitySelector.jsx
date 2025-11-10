"use client";
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ onQuantityChange = () => {}, maxQuantity = 100 }) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= maxQuantity) {
      setQuantity(value);
      onQuantityChange(value);
    }
  };

  return (
    <div className="quantity-selector">
      <label htmlFor="quantity" className="quantity-label">Quantity</label>
      <div className="quantity-controls">
        <button
          className="quantity-btn"
          onClick={handleDecrease}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
          title="Decrease quantity"
        >
          <Minus size={18} />
        </button>
        <input
          id="quantity"
          type="number"
          min="1"
          max={maxQuantity}
          value={quantity}
          onChange={handleInputChange}
          className="quantity-input"
          aria-label="Quantity"
        />
        <button
          className="quantity-btn"
          onClick={handleIncrease}
          disabled={quantity >= maxQuantity}
          aria-label="Increase quantity"
          title="Increase quantity"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}

