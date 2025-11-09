const KEY = 'zaxis_cart_v1';

export function getCart() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}

export function saveCart(items) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(product) {
  const items = getCart();
  const exists = items.find((p) => String(p.id) === String(product.id));
  if (!exists) { items.push(product); saveCart(items); }
}

export function removeFromCart(id) {
  const items = getCart().filter((p) => String(p.id) !== String(id));
  saveCart(items);
}

export function clearCart() { saveCart([]); }
