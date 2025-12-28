import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import './Dashboard.css';

function Dashboard() {
  const stats = [
    { label: 'Total Clients', value: '47', icon: 'fa-users', color: '#d4af7d' },
    { label: 'Upcoming Bookings', value: '12', icon: 'fa-calendar-check', color: '#9b7bb8' },
    { label: 'Active Members', value: '23', icon: 'fa-id-card', color: '#4ecdc4' },
    { label: 'Revenue This Month', value: '$3,450', icon: 'fa-dollar-sign', color: '#45b7d1' },
  ];

  const recentActivity = [
    { action: 'New booking', detail: 'Sarah M. booked a 1:1 Support Session', time: '2 hours ago', icon: 'fa-calendar-plus' },
    { action: 'New member', detail: 'Emily R. joined the Sanctuary (Member tier)', time: '5 hours ago', icon: 'fa-user-plus' },
    { action: 'Session completed', detail: 'Energetic Scan with Jennifer L.', time: '1 day ago', icon: 'fa-check-circle' },
    { action: 'Payment received', detail: '$150 from Amanda K.', time: '1 day ago', icon: 'fa-credit-card' },
    { action: 'New inquiry', detail: 'Contact form submission from Lisa T.', time: '2 days ago', icon: 'fa-envelope' },
  ];

  return (
    <AdminLayout>
      <div className="dashboard-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Dashboard</h1>
            <p>Welcome back, Timberly</p>
          </div>
          <div className="header-actions">
            <span className="current-date">
              <i className="fas fa-calendar"></i>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
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
          {/* Recent Activity */}
          <div className="dashboard-card activity-card">
            <div className="card-header">
              <h2>Recent Activity</h2>
              <button className="view-all-btn">View All</button>
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

          {/* Quick Actions */}
          <div className="dashboard-card actions-card">
            <div className="card-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <button className="action-btn">
                <i className="fas fa-user-plus"></i>
                <span>Add Client</span>
              </button>
              <button className="action-btn">
                <i className="fas fa-calendar-plus"></i>
                <span>New Booking</span>
              </button>
              <button className="action-btn">
                <i className="fas fa-envelope"></i>
                <span>Send Email</span>
              </button>
              <button className="action-btn">
                <i className="fas fa-file-alt"></i>
                <span>Create Content</span>
              </button>
            </div>

            {/* Upcoming Today */}
            <div className="upcoming-section">
              <h3>Upcoming Today</h3>
              <div className="upcoming-list">
                <div className="upcoming-item">
                  <div className="upcoming-time">10:00 AM</div>
                  <div className="upcoming-info">
                    <span className="upcoming-client">Sarah M.</span>
                    <span className="upcoming-service">1:1 Support Session</span>
                  </div>
                </div>
                <div className="upcoming-item">
                  <div className="upcoming-time">2:30 PM</div>
                  <div className="upcoming-info">
                    <span className="upcoming-client">Jennifer L.</span>
                    <span className="upcoming-service">Energetic Scan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
