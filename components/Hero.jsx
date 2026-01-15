"use client";
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

// Product-specific SVG icons for placeholder backgrounds
const ProductIcons = {
  // Keychain icon - modern design with gradient
  keychain: () => (
    <svg viewBox="0 0 400 300" className="hero-placeholder-svg" aria-hidden="true">
      <defs>
        <linearGradient id="tealVioletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
        </linearGradient>
        <filter id="glow1">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Background glow */}
      <circle cx="200" cy="150" r="120" fill="url(#glowGrad)" />
      {/* Ring */}
      <circle cx="140" cy="100" r="35" fill="none" stroke="url(#tealVioletGrad)" strokeWidth="8" filter="url(#glow1)" />
      <circle cx="140" cy="100" r="20" fill="none" stroke="url(#tealVioletGrad)" strokeWidth="4" opacity="0.5" />
      {/* Chain links */}
      <ellipse cx="175" cy="125" rx="12" ry="8" fill="none" stroke="url(#tealVioletGrad)" strokeWidth="4" transform="rotate(45, 175, 125)" />
      <ellipse cx="195" cy="145" rx="12" ry="8" fill="none" stroke="url(#tealVioletGrad)" strokeWidth="4" transform="rotate(45, 195, 145)" />
      {/* Keychain body */}
      <rect x="210" y="155" width="80" height="100" rx="12" fill="none" stroke="url(#tealVioletGrad)" strokeWidth="6" filter="url(#glow1)" />
      <rect x="220" y="165" width="60" height="80" rx="8" fill="url(#glowGrad)" />
      {/* Custom text indicator */}
      <text x="250" y="210" textAnchor="middle" fill="url(#tealVioletGrad)" fontSize="18" fontWeight="bold">ABC</text>
      {/* Decorative dots */}
      <circle cx="320" cy="80" r="4" fill="#06B6D4" opacity="0.6" />
      <circle cx="340" cy="100" r="3" fill="#8B5CF6" opacity="0.5" />
      <circle cx="80" cy="200" r="5" fill="#84CC16" opacity="0.4" />
    </svg>
  ),

  // Lithophane icon - photo frame with backlight effect
  lithophane: () => (
    <svg viewBox="0 0 400 300" className="hero-placeholder-svg" aria-hidden="true">
      <defs>
        <linearGradient id="tealVioletGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="lightGlow" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <linearGradient id="photoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="50%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </linearGradient>
        <filter id="glow2">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Backlight rays */}
      <ellipse cx="200" cy="150" rx="140" ry="100" fill="url(#lightGlow)" />
      {/* Frame outer */}
      <rect x="120" y="60" width="160" height="180" rx="8" fill="none" stroke="url(#tealVioletGrad2)" strokeWidth="6" filter="url(#glow2)" />
      {/* Frame inner - photo area */}
      <rect x="135" y="75" width="130" height="150" rx="4" fill="url(#photoGrad)" />
      {/* Photo content silhouette - mountains and sun */}
      <circle cx="175" cy="120" r="20" fill="#FBBF24" opacity="0.7" />
      <polygon points="150,200 185,140 220,200" fill="#06B6D4" opacity="0.5" />
      <polygon points="180,200 225,130 265,200" fill="#8B5CF6" opacity="0.4" />
      {/* Light stand base */}
      <rect x="175" y="245" width="50" height="8" rx="3" fill="url(#tealVioletGrad2)" />
      <rect x="185" y="253" width="30" height="4" rx="2" fill="url(#tealVioletGrad2)" opacity="0.6" />
      {/* LED indicator */}
      <circle cx="275" cy="240" r="6" fill="#84CC16" filter="url(#glow2)" />
      {/* Decorative elements */}
      <circle cx="80" cy="80" r="4" fill="#06B6D4" opacity="0.5" />
      <circle cx="320" cy="220" r="3" fill="#8B5CF6" opacity="0.4" />
    </svg>
  ),

  // Nameplate icon - desk sign with 3D effect
  nameplate: () => (
    <svg viewBox="0 0 400 300" className="hero-placeholder-svg" aria-hidden="true">
      <defs>
        <linearGradient id="tealVioletGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="plateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <filter id="glow3">
          <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Background glow */}
      <ellipse cx="200" cy="150" rx="160" ry="80" fill="url(#tealVioletGrad3)" opacity="0.1" />
      {/* Desk surface */}
      <path d="M50 220 L350 220 L380 280 L20 280 Z" fill="#334155" opacity="0.5" />
      {/* Nameplate 3D base */}
      <path d="M100 200 L100 180 L300 180 L300 200 L320 220 L80 220 Z" fill="#1E293B" />
      {/* Nameplate front face */}
      <rect x="80" y="110" width="240" height="90" rx="6" fill="url(#plateGrad)" stroke="url(#tealVioletGrad3)" strokeWidth="3" filter="url(#glow3)" />
      {/* Text on nameplate */}
      <text x="200" y="165" textAnchor="middle" fill="url(#tealVioletGrad3)" fontSize="28" fontWeight="bold" fontFamily="sans-serif">YOUR NAME</text>
      {/* Decorative line */}
      <line x1="110" y1="130" x2="290" y2="130" stroke="url(#tealVioletGrad3)" strokeWidth="2" opacity="0.5" />
      <line x1="110" y1="185" x2="290" y2="185" stroke="url(#tealVioletGrad3)" strokeWidth="2" opacity="0.5" />
      {/* 3D printing layer lines */}
      <line x1="85" y1="140" x2="85" y2="195" stroke="#06B6D4" strokeWidth="1" opacity="0.3" />
      <line x1="315" y1="140" x2="315" y2="195" stroke="#8B5CF6" strokeWidth="1" opacity="0.3" />
      {/* Decorative dots */}
      <circle cx="60" cy="100" r="4" fill="#84CC16" opacity="0.5" />
      <circle cx="340" cy="90" r="3" fill="#06B6D4" opacity="0.4" />
    </svg>
  ),

  // Generic 3D print icon - for unknown product types
  default: () => (
    <svg viewBox="0 0 400 300" className="hero-placeholder-svg" aria-hidden="true">
      <defs>
        <linearGradient id="tealVioletGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <filter id="glow4">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* 3D Printer frame */}
      <rect x="100" y="80" width="200" height="160" rx="8" fill="none" stroke="url(#tealVioletGrad4)" strokeWidth="4" filter="url(#glow4)" />
      {/* Print bed */}
      <rect x="120" y="200" width="160" height="10" rx="2" fill="url(#tealVioletGrad4)" opacity="0.5" />
      {/* Printing object - cube being printed */}
      <rect x="160" y="150" width="80" height="50" fill="url(#tealVioletGrad4)" opacity="0.3" />
      <rect x="160" y="150" width="80" height="50" fill="none" stroke="url(#tealVioletGrad4)" strokeWidth="2" />
      {/* Print head */}
      <rect x="180" y="100" width="40" height="20" rx="4" fill="url(#tealVioletGrad4)" />
      {/* Filament line */}
      <line x1="200" y1="120" x2="200" y2="150" stroke="#84CC16" strokeWidth="3" strokeDasharray="4 4" />
      {/* Layer lines on object */}
      <line x1="165" y1="165" x2="235" y2="165" stroke="#06B6D4" strokeWidth="1" opacity="0.5" />
      <line x1="165" y1="175" x2="235" y2="175" stroke="#06B6D4" strokeWidth="1" opacity="0.5" />
      <line x1="165" y1="185" x2="235" y2="185" stroke="#06B6D4" strokeWidth="1" opacity="0.5" />
      {/* Decorative */}
      <circle cx="320" cy="100" r="5" fill="#06B6D4" opacity="0.5" />
      <circle cx="80" cy="180" r="4" fill="#8B5CF6" opacity="0.4" />
      <circle cx="330" cy="220" r="3" fill="#84CC16" opacity="0.5" />
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
              // Check if we should use placeholder (no image or load error)
              const hasImageError = imageErrors[slide.id];
              // Only use placeholder if image_url is empty/null/undefined, or if it failed to load
              const hasValidImageUrl = slide.image_url && slide.image_url.trim() !== '' && slide.image_url !== '/placeholder.svg';
              const usePlaceholder = !hasValidImageUrl || hasImageError;

              // Get the appropriate icon for this product type
              const PlaceholderIcon = getProductIcon(slide.title);

              return (
                <div
                  key={slide.id}
                  className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                  aria-hidden={index !== currentSlide}
                >
                  {usePlaceholder ? (
                    // Render custom SVG placeholder based on product type
                    <div className="hero-placeholder-container">
                      <PlaceholderIcon />
                    </div>
                  ) : (
                    // Render actual product image
                    <Image
                      src={slide.image_url}
                      alt={slide.title}
                      width={1200}
                      height={600}
                      priority={index === currentSlide}
                      className="carousel-image"
                      onError={() => handleImageError(slide.id)}
                    />
                  )}

                  {/* Slide overlay - Modern glassmorphism design */}
                  <div className="carousel-overlay">
                    <div className="overlay-content">
                      {/* Tech badge */}
                      <div className="hero-badge">
                        <Sparkles size={14} aria-hidden="true" />
                        <span>3D Printed Excellence</span>
                      </div>

                      {/* Title with typewriter */}
                      <h2 className="overlay-title" data-typewriter={index === currentSlide ? 'active' : ''}>
                        {index === currentSlide ? displayedText : slide.title}
                        {index === currentSlide && <span className="typewriter-cursor">|</span>}
                      </h2>

                      {/* Price with mono font */}
                      {slide.price && (
                        <p className="overlay-price">
                          <span className="price-label">Starting at</span>
                          <span className="price-amount">{slide.price}</span>
                        </p>
                      )}

                      {/* Modern gradient CTA */}
                      <div className="overlay-actions">
                        <a
                          className="hero-cta-btn"
                          href={slide.button_link || '/products'}
                          aria-label="Shop now"
                        >
                          <span>Shop Now</span>
                          <ArrowRight size={18} aria-hidden="true" />
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
          {heroSlides.length > 1 && (
            <div className="carousel-dots" role="tablist" aria-label="Carousel navigation">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                  aria-selected={index === currentSlide}
                  role="tab"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
