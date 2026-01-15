"use client";
import Image from 'next/image';

export default function CustomLithophaneCard() {
  return (
    <div className="card custom-lithophane-card">
      <a href="/custom-lithophane" className="card-media">
        <div className="lithophane-card-icon">
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="lithophane-icon-svg"
          >
            {/* Lithophane frame */}
            <rect x="40" y="30" width="120" height="140" rx="8" fill="none" stroke="#4A90E2" strokeWidth="3" />
            
            {/* Image inside frame with gradient effect */}
            <defs>
              <linearGradient id="lithophaneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#E8F0FF', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#B3D9FF', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#7AB8FF', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <rect x="45" y="35" width="110" height="130" rx="6" fill="url(#lithophaneGradient)" />
            
            {/* Decorative light rays to show backlight effect */}
            <circle cx="100" cy="100" r="35" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.6" />
            <circle cx="100" cy="100" r="50" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.3" />
            
            {/* Stand base */}
            <rect x="60" y="165" width="80" height="8" rx="2" fill="#333" />
            <rect x="70" y="173" width="60" height="4" rx="1" fill="#1a1a1a" />
          </svg>
        </div>
      </a>
      <div className="card-body">
        <h3 className="card-title">Custom Lithophane</h3>
        <p className="card-desc">
          Create beautiful personalized lithophanes from your favorite photos. Choose from keychain or display sizes with LED backlight.
        </p>
        <div className="lithophane-pricing">
          <span className="price-option">
            <span className="price-label">Keychain:</span>
            <span className="price-value numeric">₹499</span>
          </span>
          <span className="price-option">
            <span className="price-label">With Light:</span>
            <span className="price-value numeric">₹899</span>
          </span>
        </div>
        <div className="card-actions">
          <a
            className="btn customize-now"
            href="/custom-lithophane"
            aria-label="Create your custom lithophane"
          >
            ✨ Customize Now
          </a>
        </div>
      </div>
    </div>
  );
}

