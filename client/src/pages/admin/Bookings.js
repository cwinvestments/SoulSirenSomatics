import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import './Bookings.css';

function Bookings() {
  const [activeFilter, setActiveFilter] = useState('all');

  const bookings = [
    { id: 1, date: '2025-01-28', time: '10:00 AM', client: 'Sarah Mitchell', service: '1:1 Support Session', status: 'confirmed' },
    { id: 2, date: '2025-01-28', time: '2:30 PM', client: 'Jennifer Lopez', service: 'Energetic Scan', status: 'confirmed' },
    { id: 3, date: '2025-01-29', time: '11:00 AM', client: 'Amanda King', service: '1:1 Support Session', status: 'pending' },
    { id: 4, date: '2025-01-30', time: '3:00 PM', client: 'Emily Roberts', service: 'Discovery Call', status: 'confirmed' },
    { id: 5, date: '2025-01-25', time: '10:00 AM', client: 'Lisa Thompson', service: '1:1 Support Session', status: 'completed' },
    { id: 6, date: '2025-01-20', time: '2:00 PM', client: 'Rachel Green', service: 'Energetic Scan', status: 'cancelled' },
  ];

  const filters = [
    { key: 'all', label: 'All Bookings' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'upcoming') return ['confirmed', 'pending'].includes(booking.status);
    if (activeFilter === 'past') return booking.status === 'completed';
    if (activeFilter === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  return (
    <AdminLayout>
      <div className="bookings-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Booking Management</h1>
            <p>View and manage all appointments</p>
          </div>
          <div className="header-actions">
            <button className="secondary-btn">
              <i className="fas fa-calendar"></i>
              Calendar View
            </button>
            <button className="primary-btn">
              <i className="fas fa-plus"></i>
              New Booking
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {filters.map((filter) => (
            <button
              key={filter.key}
              className={`filter-tab ${activeFilter === filter.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Client</th>
                <th>Service</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                  <td>{booking.time}</td>
                  <td>
                    <div className="client-name">
                      <div className="avatar">
                        {booking.client.split(' ').map(n => n[0]).join('')}
                      </div>
                      {booking.client}
                    </div>
                  </td>
                  <td>{booking.service}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" title="View">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="action-btn edit" title="Reschedule">
                        <i className="fas fa-clock"></i>
                      </button>
                      <button className="action-btn delete" title="Cancel">
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon confirmed">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="summary-info">
              <span className="summary-value">8</span>
              <span className="summary-label">Confirmed</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon pending">
              <i className="fas fa-clock"></i>
            </div>
            <div className="summary-info">
              <span className="summary-value">3</span>
              <span className="summary-label">Pending</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon completed">
              <i className="fas fa-check-double"></i>
            </div>
            <div className="summary-info">
              <span className="summary-value">45</span>
              <span className="summary-label">Completed</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon cancelled">
              <i className="fas fa-ban"></i>
            </div>
            <div className="summary-info">
              <span className="summary-value">2</span>
              <span className="summary-label">Cancelled</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Bookings;
