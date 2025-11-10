"use client";
import { useState } from 'react';

export default function ProductForm() {
  const [form, setForm] = useState({ title: '', price: '', image_url: '' });
  const [status, setStatus] = useState('');

  async function submit(e) {
    e.preventDefault();
    setStatus('Saving...');
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price) })
    });
    const json = await res.json().catch(() => ({}));
    setStatus(res.ok ? 'Saved!' : `Failed: ${json?.error || (Array.isArray(json?.details) ? json.details.join(', ') : 'Unknown error')}`);
    if (res.ok) setForm({ title: '', price: '', image_url: '' });
  }

  return (
    <form className="form" onSubmit={submit}>
      <h2>Add Product</h2>
      <label>
        Title
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </label>
      <label>
        Price (₹)
        <input required type="number" min="0" step="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
      </label>
      <label>
        Image URL
        <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
      </label>
      <button className="btn primary" type="submit">Save</button>
      <p className="status">{status}</p>
    </form>
  );
}
