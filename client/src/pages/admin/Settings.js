import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import './Settings.css';

function Settings() {
  const [notifications, setNotifications] = useState({
    newBookings: true,
    bookingReminders: true,
    newMembers: true,
    paymentNotifications: true,
    weeklyDigest: false,
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <AdminLayout>
      <div className="settings-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Settings</h1>
            <p>Manage your account and preferences</p>
          </div>
        </div>

        <div className="settings-grid">
          {/* Profile Section */}
          <div className="settings-card">
            <div className="card-header">
              <div className="card-icon">
                <i className="fas fa-user"></i>
              </div>
              <h3>Profile</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" defaultValue="Timberly" placeholder="Your name" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" defaultValue="admin@soulsirensomatics.com" placeholder="Email" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" placeholder="Leave blank to keep current" />
              </div>
              <button className="save-btn">
                <i className="fas fa-save"></i>
                Save Changes
              </button>
            </div>
          </div>

          {/* Business Info Section */}
          <div className="settings-card">
            <div className="card-header">
              <div className="card-icon">
                <i className="fas fa-building"></i>
              </div>
              <h3>Business Info</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Business Name</label>
                <input type="text" defaultValue="Soul Siren Somatics" placeholder="Business name" />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" defaultValue="hello@soulsirensomatic.com" placeholder="Contact email" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="(555) 123-4567" />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" placeholder="City, State" />
              </div>
              <button className="save-btn">
                <i className="fas fa-save"></i>
                Save Changes
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="settings-card">
            <div className="card-header">
              <div className="card-icon">
                <i className="fas fa-bell"></i>
              </div>
              <h3>Notifications</h3>
            </div>
            <div className="card-body">
              <div className="toggle-list">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">New Bookings</span>
                    <span className="toggle-desc">Get notified when someone books a session</span>
                  </div>
                  <button
                    className={`toggle-btn ${notifications.newBookings ? 'active' : ''}`}
                    onClick={() => handleNotificationChange('newBookings')}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">Booking Reminders</span>
                    <span className="toggle-desc">24-hour reminder before sessions</span>
                  </div>
                  <button
                    className={`toggle-btn ${notifications.bookingReminders ? 'active' : ''}`}
                    onClick={() => handleNotificationChange('bookingReminders')}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">New Members</span>
                    <span className="toggle-desc">Get notified when someone joins Sanctuary</span>
                  </div>
                  <button
                    className={`toggle-btn ${notifications.newMembers ? 'active' : ''}`}
                    onClick={() => handleNotificationChange('newMembers')}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">Payment Notifications</span>
                    <span className="toggle-desc">Get notified for successful payments</span>
                  </div>
                  <button
                    className={`toggle-btn ${notifications.paymentNotifications ? 'active' : ''}`}
                    onClick={() => handleNotificationChange('paymentNotifications')}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">Weekly Digest</span>
                    <span className="toggle-desc">Weekly summary of activity</span>
                  </div>
                  <button
                    className={`toggle-btn ${notifications.weeklyDigest ? 'active' : ''}`}
                    onClick={() => handleNotificationChange('weeklyDigest')}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Integrations Section */}
          <div className="settings-card">
            <div className="card-header">
              <div className="card-icon">
                <i className="fas fa-plug"></i>
              </div>
              <h3>Integrations</h3>
            </div>
            <div className="card-body">
              <div className="integration-list">
                <div className="integration-item">
                  <div className="integration-icon square">
                    <i className="fas fa-square"></i>
                  </div>
                  <div className="integration-info">
                    <span className="integration-name">Square</span>
                    <span className="integration-desc">Payment processing</span>
                  </div>
                  <span className="integration-status not-connected">Not Connected</span>
                </div>

                <div className="integration-item">
                  <div className="integration-icon calendly">
                    <i className="fas fa-calendar"></i>
                  </div>
                  <div className="integration-info">
                    <span className="integration-name">Calendly</span>
                    <span className="integration-desc">Appointment scheduling</span>
                  </div>
                  <span className="integration-status connected">Connected</span>
                </div>

                <div className="integration-item">
                  <div className="integration-icon zoom">
                    <i className="fas fa-video"></i>
                  </div>
                  <div className="integration-info">
                    <span className="integration-name">Zoom</span>
                    <span className="integration-desc">Video sessions</span>
                  </div>
                  <span className="integration-status connected">Connected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="settings-card danger">
            <div className="card-header">
              <div className="card-icon danger">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h3>Danger Zone</h3>
            </div>
            <div className="card-body">
              <div className="danger-actions">
                <div className="danger-item">
                  <div className="danger-info">
                    <span className="danger-label">Export All Data</span>
                    <span className="danger-desc">Download all your data as a backup</span>
                  </div>
                  <button className="danger-btn export">Export</button>
                </div>
                <div className="danger-item">
                  <div className="danger-info">
                    <span className="danger-label">Delete Account</span>
                    <span className="danger-desc">Permanently delete your account and all data</span>
                  </div>
                  <button className="danger-btn delete">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Settings;
