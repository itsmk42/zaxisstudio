"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Hero({ product, products = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [fadeClass, setFadeClass] = useState('fade-in');

  // Use products array if available, otherwise use single product
  const productList = products && products.length > 0 ? products : (product ? [product] : []);
  const currentProduct = productList[currentIndex] || null;

  // Auto-rotation effect
  useEffect(() => {
    if (productList.length <= 1 || isHovering) return;

    const timer = setInterval(() => {
      setFadeClass('fade-out');
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % productList.length);
        setFadeClass('fade-in');
      }, 250);
    }, 3000);

    return () => clearInterval(timer);
  }, [productList.length, isHovering]);

  const handleDotClick = (index) => {
    setFadeClass('fade-out');
    setTimeout(() => {
      setCurrentIndex(index);
      setFadeClass('fade-in');
    }, 250);
  };

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-content">
        <div
          className={`hero-card ${fadeClass}`}
          role="region"
          aria-label={`Featured: ${currentProduct?.title || 'Featured Product'}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {currentProduct ? (
            <>
              <div className="hero-media">
                {(() => {
                  const isStock = !currentProduct.image_url || /picsum\.photos/i.test(currentProduct.image_url);
                  const src = isStock ? '/placeholder.svg' : currentProduct.image_url;
                  const alt = isStock ? `Image Coming Soon — ${currentProduct.title}` : currentProduct.title;
                  return <Image src={src} alt={alt} width={820} height={540} />;
                })()}
              </div>
              <div className="hero-info">
                <h2 className="hero-title">{currentProduct.title}</h2>
                <p className="price">₹{currentProduct.price}</p>
                <div className="actions">
                  <a className="btn accent-blue" href={`/product/${currentProduct.id}`} aria-label={`View ${currentProduct.title}`}>View</a>
                  <a className="btn buy-now" href={`/checkout?buy=${currentProduct.id}`} aria-label={`Buy ${currentProduct.title} now`}>Buy Now</a>
                </div>
              </div>
            </>
          ) : (
            <div className="hero-placeholder" />
          )}
        </div>

        {/* Pagination dots */}
        {productList.length > 1 && (
          <div className="hero-pagination" role="tablist" aria-label="Featured products">
            {productList.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
