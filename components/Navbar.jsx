"use client";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const MobileMenu = dynamic(() => import('./MobileMenu'), { ssr: false });

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Close menu on route changes or ESC
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <nav className="nav navbar-dark" role="navigation" aria-label="Primary">
      <div className="container nav-inner">
        <Link className="brand" href="/">Zaxis Studio</Link>

        {/* Desktop links */}
        <div className="nav-links" id="primary-navigation" aria-hidden={open ? 'true' : 'false'}>
          <Link className="nav-link" href="/">Home</Link>
          <Link className="nav-link" href="/products">Products</Link>
          <Link className="nav-link" href="/custom">Custom Orders</Link>
          <Link className="nav-link" href="/cart">Cart</Link>
          <Link className="nav-link" href="/login" aria-label="Login">Login</Link>
        </div>

        {/* Mobile toggle */}
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
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </nav>
  );
}
