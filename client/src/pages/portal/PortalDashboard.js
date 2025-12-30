import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import { usePortalAuth } from '../../context/PortalAuthContext';
import api from '../../api';
import './PortalDashboard.css';

function PortalDashboard() {
  const { user } = usePortalAuth();
  const [dashboardData, setDashboardData] = useState({
    upcomingBookings: [],
    recentScans: [],
    membership: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [bookingsRes, scansRes, membershipRes] = await Promise.all([
        api.get('/bookings/my').catch(() => ({ data: [] })),
        api.get('/scans/my').catch(() => ({ data: [] })),
        api.get('/memberships/my').catch(err => {
          if (err.response?.status === 404) return { data: null };
          throw err;
        })
      ]);

      // Filter upcoming bookings (status != cancelled, date >= today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcomingBookings = (bookingsRes.data || [])
        .filter(booking => {
          if (booking.status === 'cancelled' || booking.status === 'completed') return false;
          const bookingDate = new Date(booking.date);
          return bookingDate >= today;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      // Get recent scans (limit to 3)
      const recentScans = (scansRes.data || [])
        .sort((a, b) => new Date(b.scan_date) - new Date(a.scan_date))
        .slice(0, 3);

      setDashboardData({
        upcomingBookings,
        recentScans,
        membership: membershipRes.data
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
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
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm} EST`;
  };

  const getTierDisplayName = (tier) => {
    switch (tier) {
      case 'free':
        return 'Observer';
      case 'seeker':
        return 'Seeker';
      case 'siren':
        return 'Siren';
      case 'inner-circle':
        return 'Inner Circle';
      case 'member':
        return 'Member';
      default:
        return tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : 'Not a member';
    }
  };

  const getMembershipBadgeClass = () => {
    const tier = dashboardData.membership?.tier;
    if (!tier) return '';
    return `tier-${tier}`;
  };

  const getNextAppointment = () => {
    if (dashboardData.upcomingBookings.length === 0) return null;
    return dashboardData.upcomingBookings[0];
  };

  const getRecentActivity = () => {
    const activities = [];

    // Add recent bookings as activity
    dashboardData.upcomingBookings.slice(0, 2).forEach(booking => {
      activities.push({
        action: 'Session booked',
        detail: `${booking.service_type} on ${formatDate(booking.date)}`,
        time: 'Upcoming',
        icon: 'fa-calendar-plus'
      });
    });

    // Add recent scans as activity
    dashboardData.recentScans.forEach(scan => {
      const status = scan.status === 'completed' ? 'Scan ready' : 'Scan pending';
      activities.push({
        action: status,
        detail: `Energetic scan from ${formatDate(scan.scan_date)}`,
        time: getRelativeTime(scan.created_at || scan.scan_date),
        icon: scan.status === 'completed' ? 'fa-check-circle' : 'fa-clock'
      });
    });

    return activities.slice(0, 3);
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} month(s) ago`;
  };

  const nextAppointment = getNextAppointment();
  const recentActivity = getRecentActivity();

  const stats = [
    {
      label: 'Upcoming Sessions',
      value: dashboardData.upcomingBookings.length.toString(),
      icon: 'fa-calendar-check',
      color: '#d4af7d'
    },
    {
      label: 'Scans Received',
      value: dashboardData.recentScans.filter(s => s.status === 'completed').length.toString(),
      icon: 'fa-file-medical-alt',
      color: '#9b7bb8'
    },
    {
      label: 'Membership',
      value: getTierDisplayName(dashboardData.membership?.tier),
      icon: 'fa-heart',
      color: dashboardData.membership ? '#4ecdc4' : '#6b5b7a'
    },
  ];

  if (loading) {
    return (
      <PortalLayout>
        <div className="portal-dashboard">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout>
        <div className="portal-dashboard">
          <div className="error-state">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button onClick={fetchDashboardData} className="retry-btn">
              <i className="fas fa-redo"></i> Try Again
            </button>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="portal-dashboard">
        {/* Welcome Header */}
        <div className="welcome-header">
          <div className="welcome-content">
            <h1>Welcome back, {user?.firstName}!</h1>
            <p>Here's an overview of your healing journey</p>
          </div>
          {dashboardData.membership && (
            <div className={`membership-badge ${getMembershipBadgeClass()}`}>
              <i className="fas fa-heart"></i>
              {getTierDisplayName(dashboardData.membership.tier)} Member
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
            {nextAppointment ? (
              <div className="appointment-content">
                <div className="appointment-service">{nextAppointment.service_type}</div>
                <div className="appointment-datetime">
                  <div className="datetime-item">
                    <i className="fas fa-calendar"></i>
                    {formatDate(nextAppointment.date)}
                  </div>
                  <div className="datetime-item">
                    <i className="fas fa-clock"></i>
                    {formatTime(nextAppointment.time)}
                  </div>
                </div>
                <div className="appointment-actions">
                  {nextAppointment.zoom_link ? (
                    <a href={nextAppointment.zoom_link} target="_blank" rel="noopener noreferrer" className="join-btn">
                      <i className="fas fa-video"></i>
                      Join Zoom
                    </a>
                  ) : (
                    <span className="join-btn disabled">
                      <i className="fas fa-video"></i>
                      Link Coming Soon
                    </span>
                  )}
                  <Link to="/portal/bookings" className="reschedule-link">
                    Manage Bookings
                  </Link>
                </div>
              </div>
            ) : (
              <div className="no-appointment">
                <div className="no-appointment-icon">
                  <i className="fas fa-calendar-plus"></i>
                </div>
                <p>No upcoming appointments</p>
                <Link to="/book" className="book-now-btn">
                  Book a Session
                </Link>
              </div>
            )}
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
                <span>{dashboardData.membership ? 'My Sanctuary' : 'Join the Sanctuary'}</span>
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
            {recentActivity.length > 0 ? (
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
            ) : (
              <div className="no-activity">
                <p>No recent activity yet. Book your first session to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sanctuary Promo (if not a member) */}
        {!dashboardData.membership && (
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
