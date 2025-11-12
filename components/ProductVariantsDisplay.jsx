"use client";
import { useState } from 'react';
import Image from 'next/image';

export default function ProductVariantsDisplay({
  variants = [],
  onVariantSelect = () => {},
  onVariantImageChange = () => {}
}) {
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
    // Notify parent of image change if variant has image
    if (variant?.image_url) {
      onVariantImageChange(variant.image_url);
    }
  };

  return (
    <div className="product-variants-display">
      <div className="variant-group">
        <label className="variant-label">Available Options</label>
        <div className="variants-list" role="group" aria-label="Product variant selection">
          {variants.map((variant) => {
            const isInStock = variant.stock_quantity > 0;
            const isSelected = selectedVariantId === variant.id;
            const hasImage = variant.image_url && variant.image_url.trim() !== '';

            return (
              <button
                key={variant.id}
                className={`variant-option ${isSelected ? 'active' : ''} ${!isInStock ? 'out-of-stock' : ''} ${hasImage ? 'has-image' : ''}`}
                onClick={() => handleVariantSelect(variant.id)}
                disabled={!isInStock}
                aria-label={`${variant.variant_name} - ₹${variant.price}${!isInStock ? ' (Out of stock)' : ''}`}
                aria-pressed={isSelected}
                title={!isInStock ? 'Out of stock' : `${variant.variant_name} - ₹${variant.price}`}
              >
                {hasImage && (
                  <div className="variant-image-thumbnail">
                    <Image
                      src={variant.image_url}
                      alt={`${variant.variant_name} thumbnail`}
                      width={60}
                      height={60}
                      className="thumbnail-img"
                    />
                  </div>
                )}
                <div className="variant-info">
                  <div className="variant-name">{variant.variant_name}</div>
                  {variant.color && <div className="variant-color" style={{ fontSize: '12px', color: '#666' }}>{variant.color}</div>}
                  <div className="variant-price">₹{variant.price}</div>
                  {!isInStock && <div className="stock-badge">Out of Stock</div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected variant details */}
      {selectedVariant && (
        <div className="selected-variant-info" style={{ marginTop: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', color: '#333', fontWeight: '600' }}>
            <strong>Selected:</strong> {selectedVariant.variant_name}
          </div>
          {selectedVariant.color && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Color: <strong>{selectedVariant.color}</strong>
            </div>
          )}
          <div style={{ fontSize: '14px', color: '#0083B0', fontWeight: '600', marginTop: '4px' }}>
            Price: ₹{selectedVariant.price}
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
          {selectedVariant.stock_quantity === 0 && (
            <div style={{ fontSize: '12px', color: '#dc3545', marginTop: '4px' }}>
              ✗ Out of stock
            </div>
          )}
        </div>
      )}
    </div>
  );
}

