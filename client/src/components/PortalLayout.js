import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePortalAuth } from '../context/PortalAuthContext';
import './PortalLayout.css';

function PortalLayout({ children }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = usePortalAuth();

  const navItems = [
    { path: '/portal/dashboard', label: 'Dashboard', icon: 'fa-home' },
    { path: '/portal/bookings', label: 'My Bookings', icon: 'fa-calendar-alt' },
    { path: '/portal/scans', label: 'My Scans', icon: 'fa-file-medical-alt' },
    { path: '/portal/sanctuary', label: 'The Sanctuary', icon: 'fa-heart', memberOnly: false },
    { path: '/portal/profile', label: 'My Profile', icon: 'fa-user' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/portal');
  };

  const isActive = (path) => location.pathname === path;

  const getInitials = () => {
    if (user) {
      return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;
    }
    return 'U';
  };

  return (
    <div className="portal-layout">
      {/* Header */}
      <header className="portal-header">
        <div className="header-left">
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
          <Link to="/portal/dashboard" className="portal-logo">
            <i className="fas fa-spa"></i>
            <span>Soul Siren Somatics</span>
          </Link>
        </div>

        <div className="header-right">
          <Link to="/" className="back-to-site">
            <i className="fas fa-external-link-alt"></i>
            <span>Back to Site</span>
          </Link>

          <div className="user-menu-wrapper">
            <button
              className="user-menu-trigger"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="user-avatar">{getInitials()}</div>
              <span className="user-name">{user?.firstName}</span>
              <i className={`fas fa-chevron-${userMenuOpen ? 'up' : 'down'}`}></i>
            </button>

            {userMenuOpen && (
              <>
                <div className="menu-overlay" onClick={() => setUserMenuOpen(false)}></div>
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-name">{user?.firstName} {user?.lastName}</span>
                    <span className="dropdown-email">{user?.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/portal/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <i className="fas fa-user"></i>
                    My Profile
                  </Link>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`portal-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.label}</span>
              {item.path === '/portal/sanctuary' && user?.membershipTier && (
                <span className={`member-badge tier-${user.membershipTier}`}>
                  {user.membershipTier === 'inner-circle' ? 'IC' : user.membershipTier[0].toUpperCase()}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/book" className="book-session-btn">
            <i className="fas fa-plus"></i>
            Book a Session
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="portal-main">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label.replace('My ', '')}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default PortalLayout;
