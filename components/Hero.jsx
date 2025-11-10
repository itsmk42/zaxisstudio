"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Hero({ products = [] }) {
  const heroProducts = products.slice(0, 3);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoPlay || heroProducts.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroProducts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay, heroProducts.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev - 1 + heroProducts.length) % heroProducts.length);
        setIsAutoPlay(false);
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => (prev + 1) % heroProducts.length);
        setIsAutoPlay(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [heroProducts.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroProducts.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroProducts.length) % heroProducts.length);
    setIsAutoPlay(false);
  };

  if (heroProducts.length === 0) return null;

  const currentProduct = heroProducts[currentSlide];
  const isStock = !currentProduct.image_url || /picsum\.photos/i.test(currentProduct.image_url);
  const src = isStock ? '/placeholder.svg' : currentProduct.image_url;
  const alt = isStock ? `Image Coming Soon — ${currentProduct.title}` : currentProduct.title;

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-content">
        <div
          className="carousel-container"
          role="region"
          aria-label="Product carousel"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {/* Carousel slides */}
          <div className="carousel-slides">
            {heroProducts.map((product, index) => {
              const isStockImg = !product.image_url || /picsum\.photos/i.test(product.image_url);
              const imgSrc = isStockImg ? '/placeholder.svg' : product.image_url;
              const imgAlt = isStockImg ? `Image Coming Soon — ${product.title}` : product.title;

              return (
                <div
                  key={product.id}
                  className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                  aria-hidden={index !== currentSlide}
                >
                  <Image
                    src={imgSrc}
                    alt={imgAlt}
                    width={1200}
                    height={600}
                    priority={index === currentSlide}
                    className="carousel-image"
                  />

                  {/* Product overlay */}
                  <div className="carousel-overlay">
                    <div className="overlay-content">
                      <h2 className="overlay-title">{product.title}</h2>
                      <p className="overlay-price">₹{product.price}</p>
                      <div className="overlay-actions">
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
                </div>
              );
            })}
          </div>

          {/* Navigation arrows */}
          <button
            className="carousel-nav carousel-nav-prev"
            onClick={prevSlide}
            aria-label="Previous slide"
            title="Previous product"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            className="carousel-nav carousel-nav-next"
            onClick={nextSlide}
            aria-label="Next slide"
            title="Next product"
          >
            <ChevronRight size={32} />
          </button>

          {/* Pagination dots */}
          <div className="carousel-dots" role="tablist" aria-label="Slide navigation">
            {heroProducts.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                role="tab"
                aria-selected={index === currentSlide}
                aria-label={`Go to slide ${index + 1}`}
                title={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
