'use client';

import { useEffect, useState } from 'react';
import { getCart, clearCart } from '../lib/cart';
import { notify } from './admin/Toast';

export default function CheckoutClientNew() {
  const [items, setItems] = useState([]);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);

  const [form, setForm] = useState({
    // Step 1: Contact & Address
    pincode: '',
    city: '',
    state: '',
    name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    landmark: '',
    address_type: 'home',
    gst_invoice: false,
    gstin: '',
    company_name: '',
    // Step 3: Payment
    payment_method: 'upi',
  });

  const [pincodeError, setPincodeError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const url = new URL(window.location.href);
    const buyId = url.searchParams.get('buy');
    const cart = getCart();
    if (buyId) {
      const single = cart.find((p) => String(p.id) === String(buyId));
      setItems(single ? [single] : cart);
    } else {
      setItems(cart);
    }
  }, []);

  // Validate pincode and fetch city/state
  const validatePincode = async (pincode) => {
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setPincodeError('Please enter a valid 6-digit pincode');
      setForm((prev) => ({ ...prev, city: '', state: '' }));
      return false;
    }

    try {
      // Use our API route for pincode lookup
      const response = await fetch(`/api/pincode?pincode=${pincode}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setForm((prev) => ({
          ...prev,
          city: data.city,
          state: data.state,
        }));
        setPincodeError('');
        return true;
      } else {
        setPincodeError(data.error || 'Pincode not found. Please check and try again.');
        setForm((prev) => ({ ...prev, city: '', state: '' }));
        return false;
      }
    } catch (error) {
      console.error('Pincode validation error:', error);
      setPincodeError('Unable to validate pincode. Please try again.');
      setForm((prev) => ({ ...prev, city: '', state: '' }));
      return false;
    }
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, pincode: value }));
    setPincodeError(''); // Clear error when user starts typing
    if (value.length === 6) {
      validatePincode(value);
    } else if (value.length < 6) {
      // Clear city/state if pincode is incomplete
      setForm((prev) => ({ ...prev, city: '', state: '' }));
    }
  };

  const validateStep1 = () => {
    if (!form.pincode || !form.name || !form.email || !form.phone || !form.address_line1) {
      notify('Please fill in all required fields', 'error');
      return false;
    }
    if (form.gst_invoice && (!form.gstin || !form.company_name)) {
      notify('Please fill in GST details', 'error');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setIsLoading(false);
      setStatus('');
    } else if (step === 2) {
      setStep(3);
      setIsLoading(false);
      setStatus('');
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setIsLoading(false);
      setStatus('');
    }
  };

  async function placeOrder(e) {
    e.preventDefault();
    setIsLoading(true);
    setStatus('Placing order...');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(({ id, title, price }) => ({ id, title, price })),
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: `${form.address_line1}, ${form.address_line2 || ''}, ${form.landmark || ''}, ${form.city}, ${form.state} ${form.pincode}`,
            pincode: form.pincode,
            city: form.city,
            state: form.state,
            address_type: form.address_type,
            gst_invoice: form.gst_invoice,
            gstin: form.gstin,
            company_name: form.company_name,
          },
          payment: {
            method: form.payment_method,
          },
        }),
      });

      if (response.ok) {
        clearCart();
        setStatus('✓ Order placed successfully! We will contact you soon.');
        notify('Order placed successfully!', 'success');
        setTimeout(() => {
          window.location.href = '/account/confirmed';
        }, 2000);
      } else {
        const err = await response.text();
        setStatus('Failed to place order: ' + err);
        notify('Failed to place order', 'error');
      }
    } catch (error) {
      setStatus('Error: ' + error.message);
      notify('Error placing order', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  const total = items.reduce((sum, p) => sum + (p.price || 0), 0);

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <p>Your cart is empty.</p>
        <a href="/products" className="btn btn-primary">
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      {/* Trust Bar */}
      <div className="checkout-trust-bar">
        <div className="trust-item">
          <span className="trust-icon">🔒</span>
          <span>Secure Checkout</span>
        </div>
        <div className="trust-item">
          <span className="trust-icon">✓</span>
          <span>100% Secure</span>
        </div>
        <div className="trust-item">
          <span className="trust-icon">🚚</span>
          <span>Fast Delivery</span>
        </div>
      </div>

      <div className="checkout-grid">
        {/* Order Summary - Collapsible on Mobile */}
        <div className={`checkout-summary ${orderSummaryOpen ? 'open' : ''}`}>
          <button
            className="summary-toggle"
            onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
          >
            <span>Order Summary ({items.length} items)</span>
            <span className="toggle-icon">{orderSummaryOpen ? '▼' : '▶'}</span>
          </button>

          <div className="summary-content">
            <ul className="cart-list">
              {items.map((p) => (
                <li key={p.id} className="cart-item">
                  <span>{p.title}</span>
                  <span>₹{p.price?.toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="cart-footer">
              <span>Total:</span>
              <span className="total-amount">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <form className="checkout-form" onSubmit={placeOrder}>
          {/* Step Indicator */}
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <span>1</span>
              <label>Address</label>
            </div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <span>2</span>
              <label>Shipping</label>
            </div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <span>3</span>
              <label>Payment</label>
            </div>
          </div>

          {/* Step 1: Contact & Address */}
          {step === 1 && (
            <div className="checkout-step">
              <h2>Delivery Address</h2>

              <div className="form-group">
                <label htmlFor="pincode">Pincode *</label>
                <input
                  id="pincode"
                  type="text"
                  maxLength="6"
                  placeholder="Enter 6-digit pincode"
                  value={form.pincode}
                  onChange={handlePincodeChange}
                  required
                />
                {pincodeError && <span className="error-text">{pincodeError}</span>}
                {form.city && form.state && (
                  <span className="success-text">✓ {form.city}, {form.state}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="10-digit mobile"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address1">Address Line 1 *</label>
                <input
                  id="address1"
                  type="text"
                  placeholder="House no., Building name"
                  value={form.address_line1}
                  onChange={(e) => setForm({ ...form, address_line1: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address2">Address Line 2</label>
                <input
                  id="address2"
                  type="text"
                  placeholder="Road name, Area, Colony"
                  value={form.address_line2}
                  onChange={(e) => setForm({ ...form, address_line2: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="landmark">Landmark</label>
                <input
                  id="landmark"
                  type="text"
                  placeholder="e.g., Near XYZ Store"
                  value={form.landmark}
                  onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Address Type</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="home"
                      checked={form.address_type === 'home'}
                      onChange={(e) => setForm({ ...form, address_type: e.target.value })}
                    />
                    Home
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="work"
                      checked={form.address_type === 'work'}
                      onChange={(e) => setForm({ ...form, address_type: e.target.value })}
                    />
                    Work
                  </label>
                </div>
              </div>

              {/* GST Invoice Option */}
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.gst_invoice}
                    onChange={(e) => setForm({ ...form, gst_invoice: e.target.checked })}
                  />
                  I need GST invoice
                </label>
              </div>

              {form.gst_invoice && (
                <>
                  <div className="form-group">
                    <label htmlFor="gstin">GSTIN</label>
                    <input
                      id="gstin"
                      type="text"
                      placeholder="15-digit GSTIN"
                      value={form.gstin}
                      onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Company Name</label>
                    <input
                      id="company"
                      type="text"
                      placeholder="Your company name"
                      value={form.company_name}
                      onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Shipping Method */}
          {step === 2 && (
            <div className="checkout-step">
              <h2>Shipping Method</h2>
              <div className="shipping-option">
                <label className="radio-label">
                  <input type="radio" name="shipping" defaultChecked />
                  Standard Delivery (5-7 business days) - FREE
                </label>
              </div>
              <div className="shipping-option">
                <label className="radio-label">
                  <input type="radio" name="shipping" />
                  Express Delivery (2-3 business days) - ₹99
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Payment Method */}
          {step === 3 && (
            <div className="checkout-step">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    value="upi"
                    checked={form.payment_method === 'upi'}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                  />
                  <span className="payment-label">
                    <span className="payment-icon">📱</span>
                    <span>UPI / QR Code</span>
                  </span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    value="card"
                    checked={form.payment_method === 'card'}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                  />
                  <span className="payment-label">
                    <span className="payment-icon">💳</span>
                    <span>Credit / Debit Card</span>
                  </span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    value="wallet"
                    checked={form.payment_method === 'wallet'}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                  />
                  <span className="payment-label">
                    <span className="payment-icon">💰</span>
                    <span>Wallets (Paytm, PhonePe, Amazon Pay)</span>
                  </span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    value="netbanking"
                    checked={form.payment_method === 'netbanking'}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                  />
                  <span className="payment-label">
                    <span className="payment-icon">🏦</span>
                    <span>Net Banking</span>
                  </span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    value="cod"
                    checked={form.payment_method === 'cod'}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                  />
                  <span className="payment-label">
                    <span className="payment-icon">🚚</span>
                    <span>Cash on Delivery</span>
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Status Message */}
          {status && <p className={`status ${status.includes('✓') ? 'success' : 'error'}`}>{status}</p>}

          {/* Navigation Buttons */}
          <div className="checkout-actions">
            {step > 1 && (
              <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
                ← Back
              </button>
            )}
            {step < 3 && (
              <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                Next →
              </button>
            )}
            {step === 3 && (
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

