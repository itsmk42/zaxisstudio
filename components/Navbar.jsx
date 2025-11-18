"use client";
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Menu, ShoppingCart, User } from 'lucide-react';

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
            <Menu size={20} aria-hidden="true" />
          </button>

          {/* Center: Brand Logo */}
          <Link className="brand brand-logo" href="/" aria-label="Zaxis Studio Home">
            <Image
              src="/axis-logo.svg"
              alt="Zaxis Studio Logo"
              width={120}
              height={50}
              priority
            />
          </Link>

          {/* Right: Cart & Account Icons */}
          <div className="nav-icons">
            {/* Cart Icon */}
            <Link href="/cart" className="nav-icon-btn" aria-label={`Cart with ${cartCount} items`}>
              <ShoppingCart size={20} aria-hidden="true" />
              {cartCount > 0 && (
                <span className="cart-badge" aria-label={`${cartCount} items`}>{cartCount}</span>
              )}
            </Link>

            {/* Account Icon */}
            <Link href="/login" className="nav-icon-btn" aria-label="Login or account">
              <User size={20} aria-hidden="true" />
            </Link>
          </div>

          {/* Desktop links */}
          <div className="nav-links" id="primary-navigation" aria-hidden={open ? 'true' : 'false'}>
            <Link className="nav-link" href="/">Home</Link>
            <Link className="nav-link" href="/products">Products</Link>
            <Link className="nav-link" href="/custom-keychain">Custom Keychain</Link>
            <Link className="nav-link" href="/custom">Custom Orders</Link>
            <Link className="nav-link" href="/track-order">Track Order</Link>
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
