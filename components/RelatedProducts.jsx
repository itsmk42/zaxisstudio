"use client";
import { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AddToCartButton from './AddToCartButton';

export default function RelatedProducts({ products = [] }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="related-products">
      <h2>You Might Also Like</h2>
      
      <div className="related-carousel-container">
        <button
          className="carousel-scroll-btn carousel-scroll-prev"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          title="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="related-carousel" ref={scrollContainerRef} role="region" aria-label="Related products">
          {products.map((product) => {
            const isStock = !product.image_url || /picsum\.photos/i.test(product.image_url);
            const src = isStock ? '/placeholder.svg' : product.image_url;
            const alt = isStock ? `Image Coming Soon — ${product.title}` : product.title;

            return (
              <div key={product.id} className="related-product-card">
                <a href={`/product/${product.id}`} className="related-card-media">
                  <Image
                    src={src}
                    alt={alt}
                    width={300}
                    height={300}
                    className="related-card-image"
                  />
                </a>
                <div className="related-card-body">
                  <h3 className="related-card-title">{product.title}</h3>
                  <p className="related-card-price">₹{product.price}</p>
                  <AddToCartButton product={product} />
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="carousel-scroll-btn carousel-scroll-next"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          title="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}

