import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import './AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Try real API first
      const response = await api.post('/auth/login', { email, password });

      // Check if user is admin
      if (response.data.user.role !== 'admin') {
        setError('Not authorized. Admin access only.');
        setLoading(false);
        return;
      }

      // Store token and admin user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      localStorage.setItem('isAdminLoggedIn', 'true');

      navigate('/admin/dashboard');
    } catch (err) {
      // If API fails, fall back to demo mode
      if (err.response) {
        setError(err.response.data?.error?.message || 'Invalid email or password');
      } else {
        // API unavailable - try hardcoded admin login
        console.log('API unavailable, trying demo mode...');
        if (email === 'admin@soulsirensomatics.com' && password === 'admin123') {
          localStorage.setItem('isAdminLoggedIn', 'true');
          navigate('/admin/dashboard');
        } else {
          setError('Invalid email or password');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <i className="fas fa-spa"></i>
            </div>
            <h1>Soul Siren Admin</h1>
            <p>Sign in to access the dashboard</p>
          </div>

          {error && (
            <div className="login-error">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <i className="fas fa-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <a href="/" className="back-link">
              <i className="fas fa-arrow-left"></i>
              Back to Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
