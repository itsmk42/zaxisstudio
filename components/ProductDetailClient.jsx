"use client";
import { useState } from 'react';
import ProductGallery from './ProductGallery';
import ProductVariantsDisplay from './ProductVariantsDisplay';
import QuantitySelector from './QuantitySelector';
import Accordion from './Accordion';
import ReviewsSection from './ReviewsSection';
import RelatedProducts from './RelatedProducts';
import AddToCartButton from './AddToCartButton';

export default function ProductDetailClient({ product, relatedProducts = [] }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [variantImageUrl, setVariantImageUrl] = useState(null);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  // Handle scroll to show/hide sticky CTA
  const handleScroll = () => {
    const actionBlockElement = document.getElementById('action-block');
    if (actionBlockElement) {
      const rect = actionBlockElement.getBoundingClientRect();
      setShowStickyCTA(rect.bottom < 0);
    }
  };

  // Add scroll listener
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll);
  }

  const isStock = !product.image_url || /picsum\.photos/i.test(product.image_url);
  const productImage = isStock ? '/placeholder.svg' : product.image_url;

  // If variant has an image, use it as the primary image
  const primaryImage = variantImageUrl || productImage;

  // Get images from product.images array or fallback to single image_url
  const productImages = variantImageUrl
    ? [variantImageUrl] // If variant has image, show only that
    : (product.images && product.images.length > 0
        ? product.images
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
            .map(img => isStock ? '/placeholder.svg' : img.image_url)
        : [productImage]);

  // Build specifications from product data
  const specifications = product.specifications && product.specifications.length > 0
    ? product.specifications
    : [
        { spec_key: 'Dimensions', spec_value: '6" x 6" x 8"' },
        { spec_key: 'Material', spec_value: 'Premium PLA with LED components' },
        { spec_key: 'Power', spec_value: 'Wall-powered, 5V USB' },
        { spec_key: 'Weight', spec_value: '250g' },
      ];

  // Accordion items for details
  const detailsItems = [
    {
      title: 'Description',
      content: (
        <div>
          <p>{product.description || 'Premium quality product crafted with attention to detail.'}</p>
          <ul style={{ marginTop: '12px', paddingLeft: '20px' }}>
            <li>High-quality materials</li>
            <li>Carefully crafted design</li>
            <li>Perfect for gifts or personal use</li>
            <li>Durable and long-lasting</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Specifications',
      content: (
        <div>
          <dl style={{ display: 'grid', gap: '12px' }}>
            {specifications.map((spec, idx) => (
              <div key={idx}>
                <dt style={{ fontWeight: 'bold' }}>{spec.spec_key}</dt>
                <dd>{spec.spec_value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ),
    },
    {
      title: 'Shipping & Returns',
      content: (
        <div>
          <p><strong>Free Shipping:</strong> On orders over ₹500</p>
          <p><strong>Delivery Time:</strong> 5-7 business days</p>
          <p><strong>Returns:</strong> 30-day money-back guarantee</p>
          <p><strong>Warranty:</strong> 1-year manufacturer warranty</p>
        </div>
      ),
    },
  ];

  return (
    <div className="product-detail-page">
      {/* Sticky header */}
      <div className="product-sticky-header">
        <div className="container">
          <a href="/" className="sticky-logo" aria-label="Zaxis Studio home">
            <img src="/axis-logo.svg" alt="Zaxis Studio" style={{ height: '40px' }} />
          </a>
          <div className="sticky-actions">
            <a href="/cart" className="cart-icon" aria-label="Shopping cart">
              🛒
            </a>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <a href="/products">Products</a>
        <span>/</span>
        <span aria-current="page">{product.title}</span>
      </nav>

      {/* Main content */}
      <div className="container product-detail-container">
        {/* Gallery section */}
        <div className="product-gallery-section">
          <ProductGallery images={productImages} productTitle={product.title} />
        </div>

        {/* Info section */}
        <div className="product-info-section">
          {/* Title and rating */}
          <div className="product-header">
            <h1 className="product-title">{product.title}</h1>
            <div className="product-rating">
              <span className="stars">★★★★☆</span>
              <span className="review-count">(1,024 Reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="product-price-section">
            <div className="price-display">
              <span className="current-price">₹{product.price}</span>
              <span className="original-price">₹{Math.round(product.price * 1.4)}</span>
            </div>
            <div className="price-savings">
              Save ₹{Math.round(product.price * 0.4)} (29% off)
            </div>
          </div>

          {/* Action block */}
          <div id="action-block" className="product-action-block">
            {/* Variants - Only show if product has variants from database */}
            {product.variants && product.variants.length > 0 && (
              <ProductVariantsDisplay
                variants={product.variants}
                onVariantSelect={setSelectedVariant}
                onVariantImageChange={setVariantImageUrl}
              />
            )}

            {/* Quantity selector */}
            <QuantitySelector onQuantityChange={setQuantity} />

            {/* CTA buttons */}
            <div className="product-cta-buttons">
              <AddToCartButton product={product} />
              <a
                className="btn buy-now"
                href={`/checkout?buy=${product.id}`}
                aria-label={`Buy ${product.title} now`}
              >
                Buy Now
              </a>
            </div>

            {/* Trust badges */}
            <div className="trust-badges">
              <div className="badge">✓ Free Shipping on orders over ₹500</div>
              <div className="badge">✓ 30-day money-back guarantee</div>
              <div className="badge">✓ 1-year warranty</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA footer */}
      {showStickyCTA && (
        <div className="sticky-cta-footer">
          <div className="container">
            <div className="sticky-cta-content">
              <div className="sticky-price">
                <span className="price-label">Price:</span>
                <span className="price-value">₹{product.price}</span>
              </div>
              <AddToCartButton product={product} />
              <a
                className="btn buy-now"
                href={`/checkout?buy=${product.id}`}
                aria-label={`Buy ${product.title} now`}
              >
                Buy Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Details section */}
      <div className="container product-details-section">
        <h2>Product Details</h2>
        <Accordion items={detailsItems} />
      </div>

      {/* Reviews section */}
      <div className="container">
        <ReviewsSection productId={product.id} productTitle={product.title} />
      </div>

      {/* Related products */}
      <div className="container">
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}

