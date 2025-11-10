import crypto from 'crypto';

const SESSION_COOKIE = 'admin_session';
const CSRF_COOKIE = 'csrf_token';

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.JWT_SECRET || 'dev-secret-change-me';
  return secret;
}

export function createCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function signSession(payload, maxAgeSeconds = 60 * 60 * 8) { // 8 hours
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + maxAgeSeconds;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const data = `${header}.${body}`;
  const signature = crypto.createHmac('sha256', getSecret()).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function verifySession(token) {
  try {
    const [header, body, signature] = token.split('.');
    const data = `${header}.${body}`;
    const expected = crypto.createHmac('sha256', getSecret()).update(data).digest('base64url');
    if (signature !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export const cookies = { SESSION_COOKIE, CSRF_COOKIE };

