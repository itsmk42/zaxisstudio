"use client";
import { useState } from 'react';

export default function ProductVariantsDisplay({ variants = [], onVariantSelect = () => {} }) {
  // If no variants, don't render anything
  if (!variants || variants.length === 0) {
    return null;
  }

  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id || null);
  const selectedVariant = variants.find(v => v.id === selectedVariantId);

  const handleVariantSelect = (variantId) => {
    setSelectedVariantId(variantId);
    const variant = variants.find(v => v.id === variantId);
    onVariantSelect(variant);
  };

  return (
    <div className="product-variants-display">
      <div className="variant-group">
        <label className="variant-label">Available Options</label>
        <div className="variants-list" role="group" aria-label="Product variant selection">
          {variants.map((variant) => {
            const isInStock = variant.stock_quantity > 0;
            const isSelected = selectedVariantId === variant.id;

            return (
              <button
                key={variant.id}
                className={`variant-option ${isSelected ? 'active' : ''} ${!isInStock ? 'out-of-stock' : ''}`}
                onClick={() => handleVariantSelect(variant.id)}
                disabled={!isInStock}
                aria-label={`${variant.variant_name} - ₹${variant.price}${!isInStock ? ' (Out of stock)' : ''}`}
                aria-pressed={isSelected}
                title={!isInStock ? 'Out of stock' : `${variant.variant_name} - ₹${variant.price}`}
              >
                <div className="variant-name">{variant.variant_name}</div>
                <div className="variant-price">₹{variant.price}</div>
                {!isInStock && <div className="stock-badge">Out of Stock</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected variant details */}
      {selectedVariant && (
        <div className="selected-variant-info" style={{ marginTop: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>
            <strong>Selected:</strong> {selectedVariant.variant_name}
          </div>
          {selectedVariant.sku && (
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              SKU: {selectedVariant.sku}
            </div>
          )}
          {selectedVariant.stock_quantity > 0 && (
            <div style={{ fontSize: '12px', color: '#28a745', marginTop: '4px' }}>
              ✓ {selectedVariant.stock_quantity} in stock
            </div>
          )}
        </div>
      )}
    </div>
  );
}

