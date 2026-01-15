import CartClient from '../../components/CartClient';

export const metadata = { title: 'Cart — Zaxis Studio' };

export default function CartPage() {
  return (
    <div className="cart-page">
      <div className="container">
        <header className="cart-page-header">
          <span className="section-badge">🛒 Your Cart</span>
          <h1 className="page-title" style={{ display: 'block', textAlign: 'center', margin: '0 auto' }}>Shopping Cart</h1>
        </header>
        <div className="cart-wrapper">
          <CartClient />
        </div>
      </div>
    </div>
  );
}
