'use client';

import { useState, useEffect } from 'react';
import { notify } from './Toast';

export default function OrderDetailsClient({ orderId, onBack }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showTrackingForm, setShowTrackingForm] = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    tracking_number: '',
    tracking_url: ''
  });

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  async function fetchOrderDetails() {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/details?id=${orderId}`);
      if (!res.ok) throw new Error('Failed to fetch order');
      const data = await res.json();
      setOrder(data);
      setTrackingForm({
        tracking_number: data.tracking_number || '',
        tracking_url: data.tracking_url || ''
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      notify('Failed to load order details', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(newStatus) {
    try {
      setUpdating(true);
      const res = await fetch(`/api/orders/details?id=${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      const data = await res.json();
      setOrder(data);
      notify(`Order status updated to ${newStatus}`, 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      notify('Failed to update order status', 'error');
    } finally {
      setUpdating(false);
    }
  }

  async function updateTracking() {
    try {
      setUpdating(true);
      const res = await fetch(`/api/orders/details?id=${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tracking_number: trackingForm.tracking_number,
          tracking_url: trackingForm.tracking_url
        })
      });
      if (!res.ok) throw new Error('Failed to update tracking');
      const data = await res.json();
      setOrder(data);
      setShowTrackingForm(false);
      notify('Tracking information updated', 'success');
    } catch (error) {
      console.error('Error updating tracking:', error);
      notify('Failed to update tracking information', 'error');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading order details...</div>;
  }

  if (!order) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Order not found</div>;
  }

  const customer = order.customer || {};
  const items = order.items || [];
  const payment = order.payment || {};
  const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <div className="order-details-container">
      <button onClick={onBack} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
        ← Back to Orders
      </button>

      <div className="order-details-grid">
        {/* Order Header */}
        <div className="order-header">
          <div>
            <h2>Order #{order.id}</h2>
            <p className="order-date">
              {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>
          <div className="order-status">
            <span className={`status-badge status-${order.status}`}>{order.status.toUpperCase()}</span>
          </div>
        </div>

        {/* Status Management */}
        <div className="order-section">
          <h3>Order Status</h3>
          <div className="status-controls">
            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(e.target.value)}
              disabled={updating}
              className="status-select"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Tracking Information */}
        <div className="order-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Tracking Information</h3>
            <button
              onClick={() => setShowTrackingForm(!showTrackingForm)}
              className="btn btn-sm btn-secondary"
            >
              {showTrackingForm ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {showTrackingForm ? (
            <div className="tracking-form">
              <input
                type="text"
                placeholder="Tracking Number"
                value={trackingForm.tracking_number}
                onChange={(e) => setTrackingForm({ ...trackingForm, tracking_number: e.target.value })}
                className="form-input"
              />
              <input
                type="url"
                placeholder="Tracking URL (e.g., https://track.example.com/...)"
                value={trackingForm.tracking_url}
                onChange={(e) => setTrackingForm({ ...trackingForm, tracking_url: e.target.value })}
                className="form-input"
              />
              <button
                onClick={updateTracking}
                disabled={updating}
                className="btn btn-primary"
              >
                Save Tracking Info
              </button>
            </div>
          ) : (
            <div className="tracking-info">
              {order.tracking_number ? (
                <>
                  <p><strong>Tracking Number:</strong> {order.tracking_number}</p>
                  {order.tracking_url && (
                    <p><strong>Tracking URL:</strong> <a href={order.tracking_url} target="_blank" rel="noopener noreferrer">{order.tracking_url}</a></p>
                  )}
                </>
              ) : (
                <p style={{ color: '#999' }}>No tracking information added yet</p>
              )}
            </div>
          )}
        </div>

        {/* Customer Information */}
        <div className="order-section">
          <h3>Customer Information</h3>
          <div className="customer-details">
            <p><strong>Name:</strong> {customer.name || '—'}</p>
            <p><strong>Email:</strong> {customer.email || '—'}</p>
            <p><strong>Phone:</strong> {customer.phone || '—'}</p>
            <p><strong>Address Type:</strong> {customer.address_type || '—'}</p>
            {customer.gst_invoice && (
              <>
                <p><strong>GST Invoice:</strong> Yes</p>
                <p><strong>GSTIN:</strong> {customer.gstin || '—'}</p>
                <p><strong>Company Name:</strong> {customer.company_name || '—'}</p>
              </>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="order-section">
          <h3>Shipping Address</h3>
          <div className="address-details">
            <p>{customer.address_line1 || '—'}</p>
            {customer.address_line2 && <p>{customer.address_line2}</p>}
            {customer.landmark && <p>{customer.landmark}</p>}
            <p>{customer.city || '—'}, {customer.state || '—'} {customer.pincode || '—'}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="order-section">
          <h3>Order Items</h3>
          <div className="items-table">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.title || '—'}</td>
                    <td>{item.quantity || 1}</td>
                    <td>₹{(item.price || 0).toLocaleString()}</td>
                    <td>₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-section">
          <h3>Order Summary</h3>
          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>₹{(order.total_amount || total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="order-section">
          <h3>Payment Information</h3>
          <div className="payment-details">
            <p><strong>Payment Method:</strong> {payment.method || 'COD'}</p>
            <p><strong>Payment Status:</strong> {payment.status || 'Pending'}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .order-details-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }

        .order-details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        .order-header h2 {
          margin: 0;
          font-size: 24px;
        }

        .order-date {
          margin: 5px 0 0 0;
          color: #666;
          font-size: 14px;
        }

        .order-status {
          text-align: right;
        }

        .status-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 12px;
          text-transform: uppercase;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-confirmed {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-shipped {
          background: #e0e7ff;
          color: #3730a3;
        }

        .status-completed {
          background: #dcfce7;
          color: #166534;
        }

        .status-cancelled {
          background: #fee2e2;
          color: #991b1b;
        }

        .order-section {
          padding: 20px;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .order-section h3 {
          margin: 0 0 15px 0;
          font-size: 18px;
        }

        .status-controls {
          display: flex;
          gap: 10px;
        }

        .status-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }

        .tracking-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .tracking-info {
          padding: 10px;
          background: #f9f9f9;
          border-radius: 4px;
        }

        .tracking-info p {
          margin: 8px 0;
        }

        .tracking-info a {
          color: #0066cc;
          text-decoration: none;
        }

        .tracking-info a:hover {
          text-decoration: underline;
        }

        .customer-details,
        .address-details,
        .payment-details {
          padding: 10px;
          background: #f9f9f9;
          border-radius: 4px;
        }

        .customer-details p,
        .address-details p,
        .payment-details p {
          margin: 8px 0;
          font-size: 14px;
        }

        .items-table {
          overflow-x: auto;
        }

        .items-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .items-table th,
        .items-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .items-table th {
          background: #f5f5f5;
          font-weight: bold;
        }

        .order-summary {
          padding: 10px;
          background: #f9f9f9;
          border-radius: 4px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }

        .summary-row.total {
          font-size: 16px;
          font-weight: bold;
          border-top: 1px solid #ddd;
          padding-top: 12px;
          margin-top: 12px;
        }

        @media (max-width: 768px) {
          .order-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .order-status {
            text-align: left;
            margin-top: 15px;
          }
        }
      `}</style>
    </div>
  );
}

