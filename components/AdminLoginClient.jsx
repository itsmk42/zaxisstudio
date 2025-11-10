"use client";
import { useEffect, useState } from 'react';

export default function AdminLoginClient() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [csrf, setCsrf] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/login/csrf');
        const data = await res.json();
        setCsrf(data.token);
      } catch {}
    })();
  }, []);
  async function login(e) {
    e.preventDefault();
    setStatus('');
    if (!username || !password) { setStatus('Enter username and password'); return; }
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password, csrf }) });
    if (res.ok) { window.location.href = '/admin'; } else { setStatus('Invalid password'); }
  }
  return (
    <form className="form" onSubmit={login}>
      <label>
        Username
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <input type="hidden" name="csrf" value={csrf} />
      <button className="btn primary" type="submit">Login</button>
      <p className="status">{status}</p>
    </form>
  );
}
