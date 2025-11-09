"use client";
import { useEffect, useState } from 'react';
import { getCart, removeFromCart, clearCart } from '../lib/cart';

export default function CartClient() {
  const [items, setItems] = useState([]);
  useEffect(() => { setItems(getCart()); }, []);
  const total = items.reduce((sum, p) => sum + (p.price || 0), 0);

  if (items.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div>
      <ul className="cart-list">
        {items.map((p) => (
          <li key={p.id} className="cart-item">
            <span>{p.title}</span>
            <span>₹{p.price}</span>
            <button className="btn" onClick={() => { removeFromCart(p.id); setItems(getCart()); }}>Remove</button>
          </li>
        ))}
      </ul>
      <div className="cart-footer">
        <span>Total: ₹{total}</span>
        <a className="btn primary" href="/checkout">Proceed to Checkout</a>
        <button className="btn" onClick={() => { clearCart(); setItems([]); }}>Clear</button>
      </div>
    </div>
  );
}
