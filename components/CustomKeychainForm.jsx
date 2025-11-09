"use client";
import { useState } from 'react';

export default function CustomKeychainForm() {
  const [text, setText] = useState('');
  const [color, setColor] = useState('Black');
  const [status, setStatus] = useState('');

  async function submit(e) {
    e.preventDefault();
    setStatus('Submitting...');
    const res = await fetch('/api/orders/custom', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'keychain', text, color })
    });
    setStatus(res.ok ? 'Request submitted!' : 'Failed');
    if (res.ok) { setText(''); setColor('Black'); }
  }

  return (
    <form className="form" onSubmit={submit}>
      <h2>Custom Keychain</h2>
      <label>
        Text
        <input value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <label>
        Color
        <select value={color} onChange={(e) => setColor(e.target.value)}>
          <option>Black</option>
          <option>White</option>
          <option>Red</option>
          <option>Blue</option>
        </select>
      </label>
      <button className="btn primary" type="submit">Submit</button>
      <p className="status">{status}</p>
    </form>
  );
}
