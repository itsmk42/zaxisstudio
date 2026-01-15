"use client";
import Image from 'next/image';
import { ShoppingCart, Zap, Eye } from 'lucide-react';
import AddToCartButton from './AddToCartButton';

// Product-specific SVG icons for placeholder backgrounds (compact versions)
const ProductIcons = {
  // Keychain icon
  keychain: () => (
    <svg viewBox="0 0 200 200" className="product-placeholder-svg" aria-hidden="true">
      <defs>
        <linearGradient id="cardTealViolet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <filter id="cardGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <circle cx="100" cy="100" r="60" fill="url(#cardTealViolet)" opacity="0.1" />
      <circle cx="70" cy="70" r="22" fill="none" stroke="url(#cardTealViolet)" strokeWidth="5" filter="url(#cardGlow)" />
      <circle cx="70" cy="70" r="12" fill="none" stroke="url(#cardTealViolet)" strokeWidth="3" opacity="0.5" />
      <ellipse cx="95" cy="90" rx="8" ry="5" fill="none" stroke="url(#cardTealViolet)" strokeWidth="3" transform="rotate(45, 95, 90)" />
      <rect x="105" cy="100" width="50" height="60" rx="8" fill="none" stroke="url(#cardTealViolet)" strokeWidth="4" filter="url(#cardGlow)" />
      <rect x="112" y="107" width="36" height="46" rx="5" fill="url(#cardTealViolet)" opacity="0.15" />
      <text x="130" y="135" textAnchor="middle" fill="url(#cardTealViolet)" fontSize="14" fontWeight="bold">ABC</text>
    </svg>
  ),

  // Lithophane icon
  lithophane: () => (
    <svg viewBox="0 0 200 200" className="product-placeholder-svg" aria-hidden="true">
      <defs>
        <linearGradient id="cardTealViolet2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="cardPhotoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </linearGradient>
        <filter id="cardGlow2">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <ellipse cx="100" cy="100" rx="70" ry="50" fill="#FBBF24" opacity="0.15" />
      <rect x="55" y="40" width="90" height="100" rx="6" fill="none" stroke="url(#cardTealViolet2)" strokeWidth="4" filter="url(#cardGlow2)" />
      <rect x="63" y="48" width="74" height="84" rx="3" fill="url(#cardPhotoGrad)" />
      <circle cx="85" cy="75" r="12" fill="#FBBF24" opacity="0.6" />
      <polygon points="70,120 95,85 120,120" fill="#06B6D4" opacity="0.4" />
      <polygon points="90,120 115,80 137,120" fill="#8B5CF6" opacity="0.3" />
      <rect x="80" y="145" width="40" height="6" rx="2" fill="url(#cardTealViolet2)" />
      <circle cx="145" cy="140" r="5" fill="#84CC16" filter="url(#cardGlow2)" />
    </svg>
  ),

  // Nameplate icon
  nameplate: () => (
    <svg viewBox="0 0 200 200" className="product-placeholder-svg" aria-hidden="true">
      <defs>
        <linearGradient id="cardTealViolet3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="cardPlateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <filter id="cardGlow3">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <ellipse cx="100" cy="100" rx="80" ry="40" fill="url(#cardTealViolet3)" opacity="0.08" />
      <path d="M30 130 L170 130 L180 160 L20 160 Z" fill="#334155" opacity="0.4" />
      <path d="M40 120 L40 110 L160 110 L160 120 L170 130 L30 130 Z" fill="#1E293B" />
      <rect x="35" y="70" width="130" height="50" rx="4" fill="url(#cardPlateGrad)" stroke="url(#cardTealViolet3)" strokeWidth="2" filter="url(#cardGlow3)" />
      <text x="100" y="100" textAnchor="middle" fill="url(#cardTealViolet3)" fontSize="16" fontWeight="bold">YOUR NAME</text>
      <line x1="50" y1="80" x2="150" y2="80" stroke="url(#cardTealViolet3)" strokeWidth="1" opacity="0.4" />
      <line x1="50" y1="112" x2="150" y2="112" stroke="url(#cardTealViolet3)" strokeWidth="1" opacity="0.4" />
    </svg>
  ),

  // Default 3D print icon
  default: () => (
    <svg viewBox="0 0 200 200" className="product-placeholder-svg" aria-hidden="true">
      <defs>
        <linearGradient id="cardTealViolet4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <filter id="cardGlow4">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect x="45" y="45" width="110" height="100" rx="6" fill="none" stroke="url(#cardTealViolet4)" strokeWidth="3" filter="url(#cardGlow4)" />
      <rect x="60" y="120" width="80" height="8" rx="2" fill="url(#cardTealViolet4)" opacity="0.4" />
      <rect x="75" y="90" width="50" height="30" fill="url(#cardTealViolet4)" opacity="0.2" />
      <rect x="75" y="90" width="50" height="30" fill="none" stroke="url(#cardTealViolet4)" strokeWidth="2" />
      <rect x="85" y="60" width="30" height="15" rx="3" fill="url(#cardTealViolet4)" />
      <line x1="100" y1="75" x2="100" y2="90" stroke="#84CC16" strokeWidth="2" strokeDasharray="3 2" />
      <line x1="78" y1="100" x2="122" y2="100" stroke="#06B6D4" strokeWidth="1" opacity="0.5" />
      <line x1="78" y1="107" x2="122" y2="107" stroke="#06B6D4" strokeWidth="1" opacity="0.5" />
      <circle cx="160" y="55" r="4" fill="#06B6D4" opacity="0.5" />
      <circle cx="40" cy="140" r="3" fill="#8B5CF6" opacity="0.4" />
    </svg>
  )
};

// Function to determine which icon to use based on product title
function getProductIcon(title) {
  const lowerTitle = (title || '').toLowerCase();
  if (lowerTitle.includes('keychain') || lowerTitle.includes('key chain') || lowerTitle.includes('key ring')) {
    return ProductIcons.keychain;
  }
  if (lowerTitle.includes('lithophane') || lowerTitle.includes('photo box') || lowerTitle.includes('photo frame') || lowerTitle.includes('light box')) {
    return ProductIcons.lithophane;
  }
  if (lowerTitle.includes('nameplate') || lowerTitle.includes('name plate') || lowerTitle.includes('desk sign') || lowerTitle.includes('name tag')) {
    return ProductIcons.nameplate;
  }
  return ProductIcons.default;
}

export default function ProductCard({ product }) {
  const isStock = !product.image_url || /picsum\.photos/i.test(product.image_url) || product.image_url === '/placeholder.svg';
  const usePlaceholder = isStock;
  const PlaceholderIcon = getProductIcon(product.title);

  return (
    <article className="product-card">
      {/* Product Image */}
      <a href={`/product/${product.id}`} className="product-card-media">
        {usePlaceholder ? (
          <div className="product-placeholder-container">
            <PlaceholderIcon />
          </div>
        ) : (
          <Image
            src={product.image_url}
            alt={product.title}
            width={400}
            height={400}
            priority={false}
            style={{ objectFit: 'cover' }}
          />
        )}
        {/* Hover overlay with quick view */}
        <div className="product-card-overlay" aria-hidden="true">
          <span className="product-quick-view">
            <Eye size={18} />
            Quick View
          </span>
        </div>
      </a>

      {/* Product Info */}
      <div className="product-card-body">
        <h3 className="product-card-title">{product.title}</h3>

        <div className="product-card-pricing">
          <span className="product-price">₹{product.price}</span>
        </div>

        {/* Action Buttons */}
        <div className="product-card-actions">
          <AddToCartButton product={product} />
          <a
            className="btn product-btn-buy"
            href={`/checkout?buy=${product.id}`}
            aria-label={`Buy ${product.title} now`}
          >
            <Zap size={16} aria-hidden="true" />
            Buy Now
          </a>
        </div>
      </div>
    </article>
  );
}
