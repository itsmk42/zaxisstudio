"use client";
import React, { useState } from 'react';
import { supabaseBrowser } from '../lib/supabaseClient';

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}
function validatePassword(pw) {
  // Min 8 chars, at least one letter and one number
  return pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
}

export default function LoginClient() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState('');
  const [terms, setTerms] = useState(false);

  async function onLogin(e) {
    e.preventDefault();
    setStatus('');
    if (!validateEmail(email)) { setStatus('Please enter a valid email.'); return; }
    if (!password) { setStatus('Please enter your password.'); return; }
    setLoading(true);
    try {
      const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = '/';
    } catch (err) {
      setStatus(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function onRegister(e) {
    e.preventDefault();
    setStatus('');
    if (!validateEmail(email)) { setStatus('Please enter a valid email.'); return; }
    if (!validatePassword(password)) { setStatus('Password must be at least 8 characters with letters and numbers.'); return; }
    if (!terms) { setStatus('Please accept the terms and conditions.'); return; }
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/account/confirmed`;
      const { error } = await supabaseBrowser.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } });
      if (error) throw error;
      setStatus('Account created. Please check your email to verify your address.');
    } catch (err) {
      setStatus(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function onForgot(e) {
    e.preventDefault();
    setForgotStatus('');
    if (!validateEmail(forgotEmail)) { setForgotStatus('Enter a valid email.'); return; }
    try {
      const redirectTo = `${window.location.origin}/account/reset`;
      const { error } = await supabaseBrowser.auth.resetPasswordForEmail(forgotEmail, { redirectTo });
      if (error) throw error;
      setForgotStatus('Password reset email sent. Check your inbox.');
    } catch (err) {
      setForgotStatus(err.message || 'Failed to send reset email.');
    }
  }

  return (
    <section>
      <div className="hero-card auth-card" style={{ padding: 20 }}>
        <div className="inline" role="tablist" aria-label="Authentication modes">
          <button className="btn accent-blue" role="tab" aria-selected={mode === 'login'} onClick={() => setMode('login')}>Login</button>
          <button className="btn accent-green" role="tab" aria-selected={mode === 'register'} onClick={() => setMode('register')}>Create Account</button>
        </div>

        {mode === 'login' ? (
          <form className="form centered" onSubmit={onLogin} aria-describedby="login-status">
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required aria-required="true" />
            </label>
            <label>
              Password
              <div className="inline">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required aria-required="true" />
                <button type="button" className="btn accent-pink" onClick={() => setShowPw((v) => !v)} aria-pressed={showPw ? 'true' : 'false'}>{showPw ? 'Hide' : 'Show'}</button>
              </div>
            </label>
            <div className="inline actions centered">
              <button className="btn primary" type="submit" disabled={loading} aria-busy={loading ? 'true' : 'false'}>
                {loading ? 'Signing in…' : 'Login'}
              </button>
              <details>
                <summary>Forgot password?</summary>
                <div className="form" style={{ marginTop: 8 }}>
                  <label>
                    Email
                    <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                  </label>
                  <button className="btn accent-blue" onClick={onForgot}>Send reset email</button>
                  <p className="status" aria-live="polite">{forgotStatus}</p>
                </div>
              </details>
            </div>
            <p id="login-status" className="status" aria-live="polite">{status}</p>
          </form>
        ) : (
          <form className="form centered" onSubmit={onRegister} aria-describedby="register-status">
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required aria-required="true" />
            </label>
            <label>
              Password
              <div className="inline">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required aria-required="true" aria-describedby="pw-help" />
                <button type="button" className="btn accent-pink" onClick={() => setShowPw((v) => !v)} aria-pressed={showPw ? 'true' : 'false'}>{showPw ? 'Hide' : 'Show'}</button>
              </div>
              <small id="pw-help" className="text-secondary">Min 8 chars, letters and numbers required.</small>
            </label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} aria-required="true" />
              <span>I agree to the <a href="#" className="text-secondary">terms and conditions</a></span>
            </label>
            <button className="btn primary" type="submit" disabled={loading} aria-busy={loading ? 'true' : 'false'}>
              {loading ? 'Creating…' : 'Create Account'}
            </button>
            <p id="register-status" className="status" aria-live="polite">{status}</p>
          </form>
        )}
      </div>
    </section>
  );
}
