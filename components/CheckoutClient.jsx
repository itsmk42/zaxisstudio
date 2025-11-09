"use client";
import { useEffect, useState } from 'react';
import { getCart, clearCart } from '../lib/cart';

export default function CheckoutClient() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const url = new URL(window.location.href);
    const buyId = url.searchParams.get('buy');
    const cart = getCart();
    if (buyId) {
      const single = cart.find((p) => String(p.id) === String(buyId));
      setItems(single ? [single] : cart);
    } else {
      setItems(cart);
    }
  }, []);

  async function placeOrder(e) {
    e.preventDefault();
    setStatus('Placing order...');
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map(({ id, title, price }) => ({ id, title, price })),
        customer: form,
        payment: { method: 'COD' }
      })
    });
    if (res.ok) {
      clearCart();
      setStatus('Order placed! We will contact you for delivery.');
    } else {
      const err = await res.text();
      setStatus('Failed to place order: ' + err);
    }
  }

  const total = items.reduce((sum, p) => sum + (p.price || 0), 0);

  if (items.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="checkout-grid">
      <div>
        <h2>Order Summary</h2>
        <ul className="cart-list">
          {items.map((p) => (
            <li key={p.id} className="cart-item">
              <span>{p.title}</span>
              <span>₹{p.price}</span>
            </li>
          ))}
        </ul>
        <div className="cart-footer"><span>Total: ₹{total}</span></div>
      </div>
      <form className="checkout-form" onSubmit={placeOrder}>
        <h2>Shipping Details</h2>
        <label>
          Name
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>
          Phone
          <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </label>
        <label>
          Address
          <textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </label>
        <button className="btn primary" type="submit">Place Order</button>
        <p className="status">{status}</p>
      </form>
    </div>
  );
}
