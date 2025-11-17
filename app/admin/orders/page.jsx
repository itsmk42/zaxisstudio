'use client';

import { useState, useEffect } from 'react';
import OrderDetailsClient from '../../../components/admin/OrderDetailsClient';
import { notify } from '../../../components/admin/Toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    // Check URL query parameter
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setSelectedOrderId(parseInt(id));
    }
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      notify('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (selectedOrderId) {
    return (
      <section>
        <h1 className="page-title">Order Details</h1>
        <OrderDetailsClient
          orderId={selectedOrderId}
          onBack={() => {
            setSelectedOrderId(null);
            window.history.pushState({}, '', '/admin/orders');
          }}
        />
      </section>
    );
  }

  return (
    <section>
      <h1 className="page-title">Orders</h1>
      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>No orders found</div>
      ) : (
        <div className="orders-list">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <div>
                      <strong>{order.customer?.name || '—'}</strong>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {order.customer?.email || '—'}
                      </div>
                    </div>
                  </td>
                  <td>{(order.items || []).length} item(s)</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        window.history.pushState({}, '', `/admin/orders?id=${order.id}`);
                      }}
                      className="btn btn-sm btn-secondary"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .orders-list {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }

        .admin-table th {
          background: #f5f5f5;
          padding: 12px;
          text-align: left;
          font-weight: bold;
          border-bottom: 2px solid #ddd;
        }

        .admin-table td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }

        .admin-table tr:hover {
          background: #f9f9f9;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          text-transform: capitalize;
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

        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
        }
      `}</style>
    </section>
  );
}
