"use client";
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Hero({ slides = [] }) {
  const heroSlides = slides.length > 0 ? slides : [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const [imageErrors, setImageErrors] = useState({});

  // Handle image load errors - fallback to placeholder
  const handleImageError = useCallback((slideId) => {
    setImageErrors(prev => ({ ...prev, [slideId]: true }));
  }, []);

  // Typewriter animation effect
  useEffect(() => {
    const currentTitle = heroSlides[currentSlide]?.title || '';
    let charIndex = 0;
    let timeoutId;

    const typeCharacter = () => {
      if (charIndex <= currentTitle.length) {
        setDisplayedText(currentTitle.substring(0, charIndex));
        charIndex++;
        timeoutId = setTimeout(typeCharacter, 50); // 50ms per character
      }
    };

    // Reset and start typing
    setDisplayedText('');
    charIndex = 0;
    typeCharacter();

    return () => clearTimeout(timeoutId);
  }, [currentSlide, heroSlides]);

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoPlay || heroSlides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay, heroSlides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
        setIsAutoPlay(false);
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsAutoPlay(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [heroSlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlay(false);
  };

  if (heroSlides.length === 0) return null;

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
            {heroSlides.map((slide, index) => {
              // Check if we should use placeholder (no image, stock image, or load error)
              const hasImageError = imageErrors[slide.id];
              const isStockImg = !slide.image_url || /picsum\.photos/i.test(slide.image_url);
              const usePlaceholder = isStockImg || hasImageError;
              const imgSrc = usePlaceholder ? '/placeholder.svg' : slide.image_url;
              const imgAlt = usePlaceholder ? `Image Coming Soon — ${slide.title}` : slide.title;
              const isSvg = imgSrc.endsWith('.svg');

              return (
                <div
                  key={slide.id}
                  className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                  aria-hidden={index !== currentSlide}
                >
                  {isSvg ? (
                    // Use standard img tag for SVGs to avoid Next.js Image issues
                    <img
                      src={imgSrc}
                      alt={imgAlt}
                      className="carousel-image"
                      loading={index === currentSlide ? "eager" : "lazy"}
                      onError={() => handleImageError(slide.id)}
                    />
                  ) : (
                    // Use Next.js Image for optimized loading of regular images
                    <Image
                      src={imgSrc}
                      alt={imgAlt}
                      width={1200}
                      height={600}
                      priority={index === currentSlide}
                      className="carousel-image"
                      onError={() => handleImageError(slide.id)}
                    />
                  )}

                  {/* Slide overlay */}
                  <div className="carousel-overlay">
                    <div className="overlay-content">
                      <h2 className="overlay-title" data-typewriter={index === currentSlide ? 'active' : ''}>
                        {index === currentSlide ? displayedText : slide.title}
                        {index === currentSlide && <span className="typewriter-cursor">|</span>}
                      </h2>
                      <p className="overlay-price">{slide.price}</p>
                      <div className="overlay-actions">
                        <a
                          className="shop-now-link"
                          href={slide.button_link || '/products'}
                          aria-label="Shop now"
                        >
                          <span>Shop Now</span>
                          <span className="arrow-icon">→</span>
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


        </div>
      </div>
    </section>
  );
}
