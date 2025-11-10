"use client";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const MobileMenu = dynamic(() => import('./MobileMenu'), { ssr: false });
const AnnouncementBar = dynamic(() => import('./AnnouncementBar'), { ssr: false });

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Get cart count from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);

    // Listen for cart updates
    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(updatedCart.length);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  // Close menu on route changes or ESC
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <nav className="nav navbar-dark" role="navigation" aria-label="Primary">
        <div className="container nav-inner">
          {/* Left: Hamburger */}
          <button
            className="nav-toggle"
            aria-label="Toggle menu"
            aria-controls="mobile-navigation"
            aria-expanded={open ? 'true' : 'false'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <svg className="hamburger" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Center: Brand */}
          <Link className="brand" href="/">Zaxis Studio</Link>

          {/* Right: Cart & Account Icons */}
          <div className="nav-icons">
            {/* Cart Icon */}
            <Link href="/cart" className="nav-icon-btn" aria-label={`Cart with ${cartCount} items`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span className="cart-badge" aria-label={`${cartCount} items`}>{cartCount}</span>
              )}
            </Link>

            {/* Account Icon */}
            <Link href="/login" className="nav-icon-btn" aria-label="Login or account">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          </div>

          {/* Desktop links */}
          <div className="nav-links" id="primary-navigation" aria-hidden={open ? 'true' : 'false'}>
            <Link className="nav-link" href="/">Home</Link>
            <Link className="nav-link" href="/products">Products</Link>
            <Link className="nav-link" href="/custom">Custom Orders</Link>
            <Link className="nav-link" href="/cart">Cart</Link>
            <Link className="nav-link" href="/login" aria-label="Login">Login</Link>
          </div>
        </div>
        <MobileMenu open={open} onClose={() => setOpen(false)} />
      </nav>

      {/* Announcement Bar */}
      <AnnouncementBar />
    </>
  );
}
