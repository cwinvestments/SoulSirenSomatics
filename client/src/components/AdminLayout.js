import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

function AdminLayout({ children }) {
  // eslint-disable-next-line no-unused-vars
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'fa-home' },
    { path: '/admin/clients', label: 'Clients', icon: 'fa-users' },
    { path: '/admin/bookings', label: 'Bookings', icon: 'fa-calendar-alt' },
    { path: '/admin/members', label: 'Members', icon: 'fa-id-card' },
    { path: '/admin/content', label: 'Content', icon: 'fa-file-alt' },
    { path: '/admin/settings', label: 'Settings', icon: 'fa-cog' },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <header className="admin-mobile-header">
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <span className="mobile-logo">Soul Siren Admin</span>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {mobileMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-logo">
            <i className="fas fa-spa"></i>
            <span>Soul Siren Admin</span>
          </h1>
        </div>

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
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
