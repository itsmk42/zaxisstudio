"use client";
import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { addToCart } from '../lib/cart';

export default function AddToCartButton({ product, selectedVariant = null, quantity = 1 }) {
  const [added, setAdded] = useState(false);

  function onClick() {
    // If product has variants and one is selected, add the variant to cart
    // Otherwise add the base product
    const itemToAdd = selectedVariant
      ? {
          ...product,
          id: `${product.id}-variant-${selectedVariant.id}`,
          variantId: selectedVariant.id,
          price: selectedVariant.price,
          title: `${product.title} - ${selectedVariant.variant_name}`,
          image_url: selectedVariant.image_url || product.image_url,
          quantity: quantity
        }
      : product;

    addToCart(itemToAdd);
    setAdded(true);
    const t = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(t);
  }

  return (
    <button
      className={`btn product-btn-cart ${added ? 'added' : ''}`}
      onClick={onClick}
      aria-label={added ? 'Added to cart' : 'Add to cart'}
      aria-disabled={added ? 'true' : 'false'}
    >
      {added ? (
        <>
          <Check size={16} aria-hidden="true" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart size={16} aria-hidden="true" />
          Add to Cart
        </>
      )}
    </button>
  );
}
