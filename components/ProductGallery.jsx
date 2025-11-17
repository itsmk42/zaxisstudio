"use client";
import { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export default function ProductGallery({ images = [], productTitle = '' }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const galleryRef = useRef(null);

  // Use provided images or fallback to placeholder
  const galleryImages = images.length > 0 ? images : ['/placeholder.svg'];

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  // Handle touch/swipe gestures
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  return (
    <div className="product-gallery" onKeyDown={handleKeyDown} tabIndex={0} role="region" aria-label="Product image gallery">
      {/* Main image display */}
      <div
        className={`gallery-main ${isZoomed ? 'zoomed' : ''}`}
        ref={galleryRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={galleryImages[currentImageIndex]}
          alt={`${productTitle} - Image ${currentImageIndex + 1}`}
          width={600}
          height={800}
          priority={currentImageIndex === 0}
          className="gallery-image"
        />
        
        {/* Zoom button */}
        <button
          className="gallery-zoom-btn"
          onClick={() => setIsZoomed(!isZoomed)}
          aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
          title={isZoomed ? 'Zoom out' : 'Zoom in'}
        >
          <ZoomIn size={20} />
        </button>

        {/* Navigation arrows for main image */}
        {galleryImages.length > 1 && (
          <>
            <button
              className="gallery-nav gallery-nav-prev"
              onClick={goToPrevious}
              aria-label="Previous image"
              title="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="gallery-nav gallery-nav-next"
              onClick={goToNext}
              aria-label="Next image"
              title="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image counter */}
        {galleryImages.length > 1 && (
          <div className="gallery-counter" aria-live="polite">
            {currentImageIndex + 1} / {galleryImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {galleryImages.length > 1 && (
        <div className="gallery-thumbnails" role="tablist" aria-label="Image thumbnails">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              className={`gallery-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => goToImage(index)}
              role="tab"
              aria-selected={index === currentImageIndex}
              aria-label={`View image ${index + 1}`}
              title={`Image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productTitle} thumbnail ${index + 1}`}
                width={80}
                height={100}
                className="thumbnail-image"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

