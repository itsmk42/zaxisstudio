"use client";
import { useState } from 'react';

export default function AdminLoginClient() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  async function login(e) {
    e.preventDefault();
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    if (res.ok) { window.location.href = '/admin'; } else { setStatus('Invalid password'); }
  }
  return (
    <form className="form" onSubmit={login}>
      <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button className="btn primary" type="submit">Login</button>
      <p className="status">{status}</p>
    </form>
  );
}
