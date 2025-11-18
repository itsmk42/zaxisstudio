'use client';

import { useState } from 'react';

export default function TrackOrderClient() {
  const [searchType, setSearchType] = useState('email');
  const [searchValue, setSearchValue] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrders([]);

    try {
      const res = await fetch(`/api/orders/search?${searchType}=${encodeURIComponent(searchValue)}`);
      if (!res.ok) throw new Error('Failed to search orders');
      
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setSearched(true);
      
      if (data.length === 0) {
        setError(`No orders found for this ${searchType}`);
      }
    } catch (err) {
      console.error('Error searching orders:', err);
      setError('Failed to search orders. Please try again.');
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#fef3c7',
      confirmed: '#dbeafe',
      shipped: '#e0e7ff',
      delivered: '#dcfce7'
    };
    return colors[status] || '#f5f5f5';
  };

  const getStatusTextColor = (status) => {
    const colors = {
      pending: '#92400e',
      confirmed: '#1e40af',
      shipped: '#3730a3',
      delivered: '#166534'
    };
    return colors[status] || '#333';
  };

  return (
    <div className="track-order-container">
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label>Search by:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="email"
                  checked={searchType === 'email'}
                  onChange={(e) => setSearchType(e.target.value)}
                />
                Email Address
              </label>
              <label>
                <input
                  type="radio"
                  value="phone"
                  checked={searchType === 'phone'}
                  onChange={(e) => setSearchType(e.target.value)}
                />
                Phone Number
              </label>
            </div>
          </div>

          <div className="form-group">
            <input
              type={searchType === 'email' ? 'email' : 'tel'}
              placeholder={searchType === 'email' ? 'Enter your email address' : 'Enter your phone number'}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              required
              className="search-input"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {searched && orders.length > 0 && (
        <div className="orders-section">
          <h2>Your Orders</h2>
          <div className="orders-grid">
            {orders.map((order) => {
              const items = order.items || [];
              const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
              
              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Order #{order.id}</h3>
                      <p className="order-date">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className="status-badge"
                      style={{
                        backgroundColor: getStatusColor(order.status),
                        color: getStatusTextColor(order.status)
                      }}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>

                  <div className="order-details">
                    <div className="detail-row">
                      <span className="label">Items:</span>
                      <span className="value">{items.length} item(s)</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Total Amount:</span>
                      <span className="value">₹{total.toLocaleString()}</span>
                    </div>
                    {order.tracking_number && (
                      <div className="detail-row">
                        <span className="label">Tracking Number:</span>
                        <span className="value">{order.tracking_number}</span>
                      </div>
                    )}
                    {order.tracking_url && (
                      <div className="detail-row">
                        <span className="label">Tracking Link:</span>
                        <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="tracking-link">
                          Track Shipment →
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="order-items">
                    <h4>Items in this order:</h4>
                    <ul>
                      {items.map((item, idx) => (
                        <li key={idx}>
                          {item.title} (Qty: {item.quantity || 1})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .track-order-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .search-section {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 8px;
          border: 1px solid #ddd;
          margin-bottom: 30px;
        }

        .search-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-group label {
          font-weight: bold;
          color: #333;
        }

        .radio-group {
          display: flex;
          gap: 20px;
        }

        .radio-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: normal;
          cursor: pointer;
        }

        .radio-group input[type="radio"] {
          cursor: pointer;
        }

        .search-input {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          font-family: inherit;
        }

        .search-input:focus {
          outline: none;
          border-color: #0066cc;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .error-message {
          background: #fee2e2;
          color: #991b1b;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
          border: 1px solid #fecaca;
        }

        .orders-section {
          margin-top: 30px;
        }

        .orders-section h2 {
          margin-bottom: 20px;
          font-size: 20px;
        }

        .orders-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .order-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }

        .order-header h3 {
          margin: 0;
          font-size: 18px;
        }

        .order-date {
          margin: 5px 0 0 0;
          color: #666;
          font-size: 13px;
        }

        .status-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 12px;
          text-transform: uppercase;
        }

        .order-details {
          margin-bottom: 20px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
          border-bottom: 1px solid #f0f0f0;
        }

        .detail-row .label {
          font-weight: 600;
          color: #666;
        }

        .detail-row .value {
          color: #333;
        }

        .tracking-link {
          color: #0066cc;
          text-decoration: none;
          font-weight: 600;
        }

        .tracking-link:hover {
          text-decoration: underline;
        }

        .order-items {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
        }

        .order-items h4 {
          margin: 0 0 10px 0;
          font-size: 14px;
        }

        .order-items ul {
          margin: 0;
          padding-left: 20px;
          list-style: disc;
        }

        .order-items li {
          margin: 5px 0;
          font-size: 13px;
          color: #666;
        }

        @media (max-width: 768px) {
          .track-order-container {
            padding: 15px;
          }

          .search-section {
            padding: 20px;
          }

          .order-header {
            flex-direction: column;
            gap: 10px;
          }

          .detail-row {
            flex-direction: column;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );
}

