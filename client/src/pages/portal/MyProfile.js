import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import { usePortalAuth } from '../../context/PortalAuthContext';
import './MyProfile.css';

function MyProfile() {
  const { user, updateUser } = usePortalAuth();
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    bookingReminders: true,
    sanctuaryUpdates: true,
    promotions: false,
  });
  const [saveStatus, setSaveStatus] = useState(null);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveProfile = () => {
    updateUser(profileData);
    setSaveStatus('profile');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const savePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // In real app, would validate current password and update
    setSaveStatus('password');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const getInitials = () => {
    return `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;
  };

  const getTierName = () => {
    if (!user?.membershipTier) return null;
    if (user.membershipTier === 'inner-circle') return 'Inner Circle';
    return user.membershipTier.charAt(0).toUpperCase() + user.membershipTier.slice(1);
  };

  return (
    <PortalLayout>
      <div className="my-profile">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="avatar-large">{getInitials()}</div>
          <div className="profile-info">
            <h1>{user?.firstName} {user?.lastName}</h1>
            <p>{user?.email}</p>
            {user?.membershipTier && (
              <span className={`member-badge tier-${user.membershipTier}`}>
                <i className="fas fa-heart"></i>
                {getTierName()} Member
              </span>
            )}
          </div>
        </div>

        <div className="profile-grid">
          {/* Edit Profile Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2><i className="fas fa-user"></i> Edit Profile</h2>
            </div>
            <div className="card-body">
              {saveStatus === 'profile' && (
                <div className="success-message">
                  <i className="fas fa-check-circle"></i>
                  Profile updated successfully!
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  placeholder="(555) 123-4567"
                />
              </div>
              <button className="save-btn" onClick={saveProfile}>
                <i className="fas fa-save"></i>
                Save Changes
              </button>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2><i className="fas fa-lock"></i> Change Password</h2>
            </div>
            <div className="card-body">
              {saveStatus === 'password' && (
                <div className="success-message">
                  <i className="fas fa-check-circle"></i>
                  Password updated successfully!
                </div>
              )}
              <form onSubmit={savePassword}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />
                </div>
                <button type="submit" className="save-btn secondary">
                  <i className="fas fa-key"></i>
                  Update Password
                </button>
              </form>
            </div>
          </div>

          {/* Membership Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2><i className="fas fa-heart"></i> Membership</h2>
            </div>
            <div className="card-body">
              {user?.membershipTier ? (
                <div className="membership-info">
                  <div className={`current-tier tier-${user.membershipTier}`}>
                    <span className="tier-name">{getTierName()}</span>
                    <span className="tier-label">Current Plan</span>
                  </div>
                  {user.memberSince && (
                    <p className="member-since">
                      Member since {new Date(user.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  )}
                  <Link to="/portal/sanctuary" className="manage-btn">
                    <i className="fas fa-cog"></i>
                    Manage Membership
                  </Link>
                </div>
              ) : (
                <div className="no-membership">
                  <p>You're not currently a Sanctuary member.</p>
                  <Link to="/portal/sanctuary" className="join-btn">
                    <i className="fas fa-heart"></i>
                    Join the Sanctuary
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Payment Methods Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2><i className="fas fa-credit-card"></i> Payment Methods</h2>
            </div>
            <div className="card-body">
              <div className="empty-payment">
                <p>No payment methods on file.</p>
                <button className="add-payment-btn">
                  <i className="fas fa-plus"></i>
                  Add Payment Method
                </button>
              </div>
            </div>
          </div>

          {/* Notification Preferences Card */}
          <div className="profile-card full-width">
            <div className="card-header">
              <h2><i className="fas fa-bell"></i> Notification Preferences</h2>
            </div>
            <div className="card-body">
              <div className="toggle-list">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">Booking Reminders</span>
                    <span className="toggle-desc">Receive reminders before your scheduled sessions</span>
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
                    <span className="toggle-label">Sanctuary Updates</span>
                    <span className="toggle-desc">Get notified about new content and upcoming lives</span>
                  </div>
                  <button
                    className={`toggle-btn ${notifications.sanctuaryUpdates ? 'active' : ''}`}
                    onClick={() => handleNotificationChange('sanctuaryUpdates')}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>
                <div className="toggle-item">
                  <div className="toggle-info">
                    <span className="toggle-label">Promotions & Offers</span>
                    <span className="toggle-desc">Receive special offers and announcements</span>
                  </div>
                  <button
                    className={`toggle-btn ${notifications.promotions ? 'active' : ''}`}
                    onClick={() => handleNotificationChange('promotions')}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

export default MyProfile;
