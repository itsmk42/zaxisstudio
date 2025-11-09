"use client";
import { useState } from 'react';

export default function LithophaneForm() {
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState('');

  async function submit(e) {
    e.preventDefault();
    setStatus('Uploading...');
    const formData = new FormData();
    if (imageFile) formData.append('image', imageFile);
    const res = await fetch('/api/orders/lithophane', { method: 'POST', body: formData });
    setStatus(res.ok ? 'Request submitted!' : 'Failed');
    if (res.ok) setImageFile(null);
  }

  return (
    <form className="form" onSubmit={submit}>
      <h2>Lithophane Photo Box</h2>
      <label>
        Upload Photo
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
      </label>
      <button className="btn primary" type="submit">Submit</button>
      <p className="status">{status}</p>
    </form>
  );
}
