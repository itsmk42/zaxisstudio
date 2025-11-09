"use client";
import Link from 'next/link';

export default function MobileMenu({ open, onClose }) {
  return (
    <div
      id="mobile-navigation"
      className={`mobile-menu${open ? ' open' : ''}`}
      aria-hidden={open ? 'false' : 'true'}
    >
      <div className="mobile-menu-header">
        <span className="mobile-brand">Menu</span>
        <button className="mobile-close" aria-label="Close menu" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="sr-only">Close</span>
        </button>
      </div>
      <div className="mobile-menu-inner">
        <Link className="mobile-link" href="/" onClick={onClose}>Home</Link>
        <Link className="mobile-link" href="/products" onClick={onClose}>Products</Link>
        <Link className="mobile-link" href="/custom" onClick={onClose}>Custom Orders</Link>
        <Link className="mobile-link" href="/cart" onClick={onClose}>Cart</Link>
      </div>
    </div>
  );
}
