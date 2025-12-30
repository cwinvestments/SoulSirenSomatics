import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import api from '../../api';
import './MyBookings.css';

function MyBookings() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/bookings/my');
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    // Handle time in HH:MM:SS or HH:MM format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm} EST`;
  };

  const isUpcoming = (booking) => {
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return false;
    }
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  };

  const upcomingBookings = bookings.filter(isUpcoming);
  const pastBookings = bookings.filter(b => !isUpcoming(b));

  const currentBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="status-badge confirmed"><i className="fas fa-check-circle"></i> Confirmed</span>;
      case 'completed':
        return <span className="status-badge completed"><i className="fas fa-check"></i> Completed</span>;
      case 'cancelled':
        return <span className="status-badge cancelled"><i className="fas fa-times-circle"></i> Cancelled</span>;
      case 'pending':
        return <span className="status-badge pending"><i className="fas fa-clock"></i> Pending</span>;
      default:
        return null;
    }
  };

  const getServiceIcon = (serviceType) => {
    if (serviceType.toLowerCase().includes('scan')) return 'fa-bolt';
    if (serviceType.toLowerCase().includes('discovery')) return 'fa-phone';
    return 'fa-user-friends';
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="my-bookings">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your bookings...</p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout>
        <div className="my-bookings">
          <div className="error-state">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button onClick={fetchBookings} className="retry-btn">
              <i className="fas fa-redo"></i> Try Again
            </button>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="my-bookings">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 style={{ color: '#2a1f35' }}>My Bookings</h1>
            <p style={{ color: '#6b5b7a' }}>View and manage your appointments</p>
          </div>
          <Link to="/book" className="book-btn">
            <i className="fas fa-plus"></i>
            Book New Session
          </Link>
        </div>

        {/* Tabs */}
        <div className="booking-tabs">
          <button
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
            {upcomingBookings.length > 0 && (
              <span className="tab-count">{upcomingBookings.length}</span>
            )}
          </button>
          <button
            className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past
          </button>
        </div>

        {/* Bookings List */}
        <div className="bookings-list">
          {currentBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3>No {activeTab} bookings</h3>
              <p>
                {activeTab === 'upcoming'
                  ? "You don't have any upcoming sessions. Book your first session!"
                  : "You don't have any past sessions yet."}
              </p>
              {activeTab === 'upcoming' && (
                <Link to="/book" className="empty-action">
                  Book a Session
                </Link>
              )}
            </div>
          ) : (
            currentBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-main">
                  <div className="booking-service">
                    <div className="service-icon">
                      <i className={`fas ${getServiceIcon(booking.service_type)}`}></i>
                    </div>
                    <div className="service-info">
                      <h3>{booking.service_type}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  <div className="booking-datetime">
                    <div className="datetime-item">
                      <i className="fas fa-calendar"></i>
                      <span>{formatDate(booking.date)}</span>
                    </div>
                    <div className="datetime-item">
                      <i className="fas fa-clock"></i>
                      <span>{formatTime(booking.time)}</span>
                    </div>
                    {booking.duration && (
                      <div className="datetime-item">
                        <i className="fas fa-hourglass-half"></i>
                        <span>{booking.duration} minutes</span>
                      </div>
                    )}
                  </div>

                  {booking.notes && (
                    <div className="booking-notes">
                      <i className="fas fa-sticky-note"></i>
                      <span>{booking.notes}</span>
                    </div>
                  )}
                </div>

                <div className="booking-actions">
                  {booking.status === 'confirmed' && (
                    <>
                      <a href={booking.zoom_link || '#'} target="_blank" rel="noopener noreferrer" className="action-btn primary">
                        <i className="fas fa-video"></i>
                        Join Session
                      </a>
                      <button className="action-btn secondary">
                        <i className="fas fa-clock"></i>
                        Reschedule
                      </button>
                      <button className="action-btn danger" onClick={() => cancelBooking(booking.id)}>
                        <i className="fas fa-times"></i>
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'pending' && (
                    <>
                      <button className="action-btn secondary">
                        <i className="fas fa-clock"></i>
                        Reschedule
                      </button>
                      <button className="action-btn danger" onClick={() => cancelBooking(booking.id)}>
                        <i className="fas fa-times"></i>
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'completed' && (
                    <Link to="/book" className="action-btn secondary">
                      <i className="fas fa-redo"></i>
                      Book Again
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Help Text */}
        <div className="help-section">
          <div className="help-card">
            <i className="fas fa-info-circle"></i>
            <div className="help-content">
              <h4>Need to make changes?</h4>
              <p>You can reschedule or cancel appointments up to 24 hours before your session. For last-minute changes, please contact us directly.</p>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

export default MyBookings;
