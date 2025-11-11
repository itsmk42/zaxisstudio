'use client';

import { useState, useMemo } from 'react';
import { notify } from './Toast';

export default function OrderManagementSection({
  orders = [],
  loading = false,
  onStatusUpdate,
  onExport
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState('desc');

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id?.toString().includes(searchLower) ||
          o.customer_name?.toLowerCase().includes(searchLower) ||
          o.customer_email?.toLowerCase().includes(searchLower) ||
          o.customer_phone?.includes(search)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (sortKey === 'amount') {
        aVal = (a.items || []).reduce((sum, i) => sum + (i.price || 0), 0);
        bVal = (b.items || []).reduce((sum, i) => sum + (i.price || 0), 0);
      }

      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [orders, search, statusFilter, sortKey, sortDir]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'pending').length;
    const completed = orders.filter((o) => o.status === 'completed').length;
    const revenue = orders.reduce(
      (sum, o) => sum + (o.items || []).reduce((s, i) => s + (i.price || 0), 0),
      0
    );

    return { total, pending, completed, revenue };
  }, [orders]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'confirmed':
        return '#3b82f6';
      case 'shipped':
        return '#8b5cf6';
      case 'completed':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="order-management">
      {/* Statistics Dashboard */}
      <div className="order-stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {stats.pending}
          </div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#10b981' }}>
            {stats.completed}
          </div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">₹{stats.revenue.toLocaleString()}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="order-filters">
        <input
          type="text"
          placeholder="Search by ID, name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={`${sortKey}:${sortDir}`}
          onChange={(e) => {
            const [key, dir] = e.target.value.split(':');
            setSortKey(key);
            setSortDir(dir);
          }}
          className="filter-select"
        >
          <option value="id:desc">ID (Newest)</option>
          <option value="id:asc">ID (Oldest)</option>
          <option value="status:asc">Status A→Z</option>
          <option value="status:desc">Status Z→A</option>
          <option value="amount:desc">Amount (High)</option>
          <option value="amount:asc">Amount (Low)</option>
        </select>

        <button className="btn btn-primary" onClick={onExport}>
          Export CSV
        </button>
      </div>

      {/* Orders Table */}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '24px' }}>
                  Loading orders…
                </td>
              </tr>
            )}
            {!loading && filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '24px' }}>
                  No orders found.
                </td>
              </tr>
            )}
            {!loading &&
              filteredOrders.map((order) => {
                const amount = (order.items || []).reduce(
                  (sum, i) => sum + (i.price || 0),
                  0
                );
                const date = order.created_at
                  ? new Date(order.created_at).toLocaleDateString()
                  : '—';

                return (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{date}</td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">{order.customer_name || '—'}</div>
                        <div className="customer-email">{order.customer_email || '—'}</div>
                      </div>
                    </td>
                    <td>{(order.items || []).length} item(s)</td>
                    <td className="amount">₹{amount.toLocaleString()}</td>
                    <td>
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                        className="status-select"
                        style={{
                          borderColor: getStatusColor(order.status),
                          color: getStatusColor(order.status),
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <a
                        className="btn btn-sm btn-secondary"
                        href={`/admin/orders?id=${order.id}`}
                      >
                        View
                      </a>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Results Count */}
      <div className="results-info">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>
    </div>
  );
}

