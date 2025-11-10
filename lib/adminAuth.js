const SESSION_COOKIE = 'admin_session';
const CSRF_COOKIE = 'csrf_token';

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.JWT_SECRET || 'dev-secret-change-me';
  return secret;
}

// Helper to convert string to base64url
function toBase64Url(str) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str).toString('base64url');
  }
  // Fallback for environments without Buffer
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Helper to convert base64url to string
function fromBase64Url(str) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'base64url').toString('utf8');
  }
  // Fallback for environments without Buffer
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  return atob(base64 + padding);
}

// Helper to convert hex string to Uint8Array
function hexToUint8Array(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// Helper to convert Uint8Array to hex string
function uint8ArrayToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper to convert Uint8Array to base64url
function uint8ArrayToBase64url(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function createCsrfToken() {
  try {
    // Try Node.js crypto first
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  } catch {
    // Fallback to Web Crypto API
    const bytes = new Uint8Array(32);
    globalThis.crypto.getRandomValues(bytes);
    return uint8ArrayToHex(bytes);
  }
}

// Async HMAC-SHA256 using Web Crypto API
async function hmacSha256Async(message, secret) {
  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await globalThis.crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return uint8ArrayToBase64url(new Uint8Array(signature));
}

// Synchronous HMAC-SHA256 using Node.js crypto (for server-side)
function hmacSha256Sync(message, secret) {
  try {
    const crypto = require('crypto');
    return crypto.createHmac('sha256', secret).update(message).digest('base64url');
  } catch {
    // Node.js crypto not available
    return null;
  }
}

export function signSession(payload, maxAgeSeconds = 60 * 60 * 8) { // 8 hours
  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + maxAgeSeconds;
  const body = toBase64Url(JSON.stringify({ ...payload, exp }));
  const data = `${header}.${body}`;

  // Use synchronous Node.js crypto for signing (only called server-side)
  const signature = hmacSha256Sync(data, getSecret());
  if (!signature) {
    throw new Error('Failed to sign session token');
  }
  return `${data}.${signature}`;
}

export async function verifySession(token) {
  try {
    const [header, body, signature] = token.split('.');
    const data = `${header}.${body}`;

    // Try synchronous Node.js crypto first (for server-side)
    let expected = hmacSha256Sync(data, getSecret());

    // If that fails, use async Web Crypto API (for Edge Runtime)
    if (!expected) {
      expected = await hmacSha256Async(data, getSecret());
    }

    if (signature !== expected) {
      return null;
    }

    const payload = JSON.parse(fromBase64Url(body));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

export const cookies = { SESSION_COOKIE, CSRF_COOKIE };

