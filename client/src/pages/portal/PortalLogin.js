import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortalAuth } from '../../context/PortalAuthContext';
import api from '../../api';
import './PortalLogin.css';

function PortalLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn } = usePortalAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/portal/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Try real API first
      const response = await api.post('/auth/login', { email, password });

      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Update auth context
      login(email, password, response.data.user, response.data.token);

      navigate('/portal/dashboard');
    } catch (err) {
      // If API fails, fall back to demo mode
      if (err.response) {
        setError(err.response.data?.error?.message || 'Invalid email or password');
      } else {
        // API unavailable - try demo login
        console.log('API unavailable, trying demo mode...');
        const result = login(email, password);
        if (result.success) {
          navigate('/portal/dashboard');
        } else {
          setError(result.error || 'Unable to connect to server. Please try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-login-page">
      <div className="login-container">
        <Link to="/" className="back-home">
          <i className="fas fa-arrow-left"></i>
          Back to Home
        </Link>

        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <i className="fas fa-spa"></i>
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to access your client portal</p>
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

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="forgot-link">Forgot Password?</a>
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
            <p>Don't have an account?</p>
            <Link to="/portal/register" className="register-link">
              Create Account
            </Link>
          </div>
        </div>

        <div className="login-help">
          <p>Need help? <a href="mailto:hello@soulsirensomatic.com">Contact Support</a></p>
        </div>
      </div>
    </div>
  );
}

export default PortalLogin;
