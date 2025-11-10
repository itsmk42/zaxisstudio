"use client";
import Link from 'next/link';
import { X } from 'lucide-react';

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
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="mobile-menu-inner">
        <Link className="mobile-link" href="/" onClick={onClose}>Home</Link>
        <Link className="mobile-link" href="/products" onClick={onClose}>Products</Link>
        <Link className="mobile-link" href="/custom" onClick={onClose}>Custom Orders</Link>
        <Link className="mobile-link" href="/cart" onClick={onClose}>Cart</Link>
        <Link className="mobile-link" href="/login" onClick={onClose}>Login</Link>
      </div>
    </div>
  );
}
