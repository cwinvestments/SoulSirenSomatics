import React from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import { usePortalAuth } from '../../context/PortalAuthContext';
import './PortalDashboard.css';

function PortalDashboard() {
  const { user } = usePortalAuth();

  const stats = [
    { label: 'Upcoming Sessions', value: '2', icon: 'fa-calendar-check', color: '#d4af7d' },
    { label: 'Scans Received', value: '3', icon: 'fa-file-medical-alt', color: '#9b7bb8' },
    {
      label: 'Membership',
      value: user?.membershipTier
        ? user.membershipTier === 'inner-circle'
          ? 'Inner Circle'
          : user.membershipTier.charAt(0).toUpperCase() + user.membershipTier.slice(1)
        : 'Not a member',
      icon: 'fa-heart',
      color: user?.membershipTier ? '#4ecdc4' : '#6b5b7a'
    },
  ];

  const nextAppointment = {
    service: '1:1 Support Session',
    date: 'Thursday, January 30, 2025',
    time: '2:00 PM EST',
    zoomLink: 'https://zoom.us/j/123456789',
  };

  const recentActivity = [
    { action: 'Session completed', detail: '1:1 Support Session with Timberly', time: '5 days ago', icon: 'fa-check-circle' },
    { action: 'Scan received', detail: 'Your energetic scan report is ready', time: '1 week ago', icon: 'fa-file-alt' },
    { action: 'Session booked', detail: 'Upcoming session on Jan 30', time: '2 weeks ago', icon: 'fa-calendar-plus' },
  ];

  const getMembershipBadgeClass = () => {
    if (!user?.membershipTier) return '';
    return `tier-${user.membershipTier}`;
  };

  return (
    <PortalLayout>
      <div className="portal-dashboard">
        {/* Welcome Header */}
        <div className="welcome-header">
          <div className="welcome-content">
            <h1>Welcome back, {user?.firstName}!</h1>
            <p>Here's an overview of your healing journey</p>
          </div>
          {user?.membershipTier && (
            <div className={`membership-badge ${getMembershipBadgeClass()}`}>
              <i className="fas fa-heart"></i>
              {user.membershipTier === 'inner-circle' ? 'Inner Circle' : user.membershipTier.charAt(0).toUpperCase() + user.membershipTier.slice(1)} Member
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Next Appointment Card */}
          <div className="dashboard-card appointment-card">
            <div className="card-header">
              <h2>
                <i className="fas fa-calendar-alt"></i>
                Next Appointment
              </h2>
            </div>
            <div className="appointment-content">
              <div className="appointment-service">{nextAppointment.service}</div>
              <div className="appointment-datetime">
                <div className="datetime-item">
                  <i className="fas fa-calendar"></i>
                  {nextAppointment.date}
                </div>
                <div className="datetime-item">
                  <i className="fas fa-clock"></i>
                  {nextAppointment.time}
                </div>
              </div>
              <div className="appointment-actions">
                <a href={nextAppointment.zoomLink} target="_blank" rel="noopener noreferrer" className="join-btn">
                  <i className="fas fa-video"></i>
                  Join Zoom
                </a>
                <Link to="/portal/bookings" className="reschedule-link">
                  Reschedule
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="dashboard-card actions-card">
            <div className="card-header">
              <h2>
                <i className="fas fa-bolt"></i>
                Quick Actions
              </h2>
            </div>
            <div className="quick-actions">
              <Link to="/book" className="action-item">
                <div className="action-icon">
                  <i className="fas fa-calendar-plus"></i>
                </div>
                <span>Book a Session</span>
                <i className="fas fa-chevron-right"></i>
              </Link>
              <Link to="/portal/sanctuary" className="action-item">
                <div className="action-icon sanctuary">
                  <i className="fas fa-heart"></i>
                </div>
                <span>Join the Sanctuary</span>
                <i className="fas fa-chevron-right"></i>
              </Link>
              <Link to="/portal/scans" className="action-item">
                <div className="action-icon scans">
                  <i className="fas fa-file-medical-alt"></i>
                </div>
                <span>View My Scans</span>
                <i className="fas fa-chevron-right"></i>
              </Link>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="dashboard-card activity-card">
            <div className="card-header">
              <h2>
                <i className="fas fa-history"></i>
                Recent Activity
              </h2>
              <Link to="/portal/bookings" className="view-all">View All</Link>
            </div>
            <div className="activity-list">
              {recentActivity.map((item, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <div className="activity-content">
                    <span className="activity-action">{item.action}</span>
                    <span className="activity-detail">{item.detail}</span>
                  </div>
                  <span className="activity-time">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sanctuary Promo (if not a member) */}
        {!user?.membershipTier && (
          <div className="sanctuary-promo">
            <div className="promo-content">
              <div className="promo-icon">
                <i className="fas fa-heart"></i>
              </div>
              <div className="promo-text">
                <h3>Join the Soul Siren Sanctuary</h3>
                <p>Weekly live sessions, fascia tools tutorials, and a supportive community of women on the same healing journey.</p>
              </div>
              <Link to="/portal/sanctuary" className="promo-btn">
                Learn More
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

export default PortalDashboard;
