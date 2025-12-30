import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import { usePortalAuth } from '../../context/PortalAuthContext';
import api from '../../api';
import './MyProfile.css';

function MyProfile() {
  const { user, updateUser } = usePortalAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStatus, setPasswordStatus] = useState(null);

  const [notifications, setNotifications] = useState({
    bookingReminders: true,
    sanctuaryUpdates: true,
    promotions: false,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/auth/me');
      const userData = response.data.user;
      setProfile(userData);
      setFormData({
        first_name: userData.firstName || '',
        last_name: userData.lastName || '',
        phone: userData.phone || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccess(false);
      setError(null);

      const response = await api.put('/auth/profile', formData);
      const updatedUser = response.data.user;

      setProfile(updatedUser);

      // Update the auth context with new user data
      if (updateUser) {
        updateUser({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          phone: updatedUser.phone
        });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const savePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // TODO: Implement password change API
    setPasswordStatus('success');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPasswordStatus(null), 3000);
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getInitials = () => {
    const firstName = profile?.firstName || user?.firstName || '';
    const lastName = profile?.lastName || user?.lastName || '';
    return `${firstName[0] || ''}${lastName[0] || ''}`;
  };

  const getTierName = () => {
    if (!user?.membershipTier) return null;
    switch (user.membershipTier) {
      case 'free':
        return 'Observer';
      case 'seeker':
        return 'Seeker';
      case 'siren':
        return 'Siren';
      case 'inner-circle':
        return 'Inner Circle';
      default:
        return user.membershipTier.charAt(0).toUpperCase() + user.membershipTier.slice(1);
    }
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="my-profile">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  if (error && !profile) {
    return (
      <PortalLayout>
        <div className="my-profile">
          <div className="error-state">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button onClick={fetchProfile} className="retry-btn">
              <i className="fas fa-redo"></i> Try Again
            </button>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="my-profile">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="avatar-large">{getInitials()}</div>
          <div className="profile-info">
            <h1>{profile?.firstName} {profile?.lastName}</h1>
            <p>{profile?.email}</p>
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
              {success && (
                <div className="success-message">
                  <i className="fas fa-check-circle"></i>
                  Profile updated successfully!
                </div>
              )}
              {error && profile && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="disabled-input"
                  />
                  <span className="input-hint">Email cannot be changed</span>
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? (
                    <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                  ) : (
                    <><i className="fas fa-save"></i> Save Changes</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2><i className="fas fa-lock"></i> Change Password</h2>
            </div>
            <div className="card-body">
              {passwordStatus === 'success' && (
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
