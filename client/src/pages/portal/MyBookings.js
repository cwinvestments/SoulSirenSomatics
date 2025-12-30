import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import './MyBookings.css';

function MyBookings() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const bookings = {
    upcoming: [
      {
        id: 1,
        service: '1:1 Support Session',
        date: 'Thursday, January 30, 2025',
        time: '2:00 PM EST',
        status: 'confirmed',
        zoomLink: 'https://zoom.us/j/123456789',
      },
      {
        id: 2,
        service: 'Energetic Scan',
        date: 'Tuesday, February 4, 2025',
        time: '10:30 AM EST',
        status: 'confirmed',
        zoomLink: 'https://zoom.us/j/987654321',
      },
    ],
    past: [
      {
        id: 3,
        service: '1:1 Support Session',
        date: 'Monday, January 20, 2025',
        time: '3:00 PM EST',
        status: 'completed',
      },
      {
        id: 4,
        service: 'Energetic Scan',
        date: 'Friday, January 10, 2025',
        time: '11:00 AM EST',
        status: 'completed',
      },
      {
        id: 5,
        service: 'Discovery Call',
        date: 'Wednesday, December 18, 2024',
        time: '2:30 PM EST',
        status: 'completed',
      },
    ],
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="status-badge confirmed"><i className="fas fa-check-circle"></i> Confirmed</span>;
      case 'completed':
        return <span className="status-badge completed"><i className="fas fa-check"></i> Completed</span>;
      case 'cancelled':
        return <span className="status-badge cancelled"><i className="fas fa-times-circle"></i> Cancelled</span>;
      default:
        return null;
    }
  };

  const currentBookings = bookings[activeTab] || [];

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
            {bookings.upcoming.length > 0 && (
              <span className="tab-count">{bookings.upcoming.length}</span>
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
                      <i className={`fas ${booking.service.includes('Scan') ? 'fa-bolt' : booking.service.includes('Discovery') ? 'fa-phone' : 'fa-user-friends'}`}></i>
                    </div>
                    <div className="service-info">
                      <h3>{booking.service}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  <div className="booking-datetime">
                    <div className="datetime-item">
                      <i className="fas fa-calendar"></i>
                      <span>{booking.date}</span>
                    </div>
                    <div className="datetime-item">
                      <i className="fas fa-clock"></i>
                      <span>{booking.time}</span>
                    </div>
                  </div>
                </div>

                <div className="booking-actions">
                  {booking.status === 'confirmed' && (
                    <>
                      <a href={booking.zoomLink} target="_blank" rel="noopener noreferrer" className="action-btn primary">
                        <i className="fas fa-video"></i>
                        Join Session
                      </a>
                      <button className="action-btn secondary">
                        <i className="fas fa-clock"></i>
                        Reschedule
                      </button>
                      <button className="action-btn danger">
                        <i className="fas fa-times"></i>
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'completed' && (
                    <button className="action-btn secondary">
                      <i className="fas fa-redo"></i>
                      Book Again
                    </button>
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
