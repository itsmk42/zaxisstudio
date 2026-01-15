"use client";
import Link from 'next/link';
import { X, Home, Package, Key, Sparkles, MapPin, ShoppingCart, User } from 'lucide-react';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/custom-keychain', label: 'Custom Keychain', icon: Key },
  { href: '/custom', label: 'Custom Orders', icon: Sparkles },
  { href: '/track-order', label: 'Track Order', icon: MapPin },
  { href: '/cart', label: 'Cart', icon: ShoppingCart },
  { href: '/login', label: 'Login', icon: User },
];

export default function MobileMenu({ open, onClose }) {
  return (
    <div
      id="mobile-navigation"
      className={`mobile-menu mobile-menu-dark${open ? ' open' : ''}`}
      aria-hidden={open ? 'false' : 'true'}
    >
      <div className="mobile-menu-header">
        <span className="mobile-brand">Zaxis Studio</span>
        <button className="mobile-close" aria-label="Close menu" onClick={onClose}>
          <X size={20} aria-hidden="true" />
        </button>
      </div>
      <nav className="mobile-menu-inner" aria-label="Mobile navigation">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            className="mobile-link"
            href={item.href}
            onClick={onClose}
          >
            <item.icon size={18} style={{ marginRight: '12px', opacity: 0.7 }} aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
