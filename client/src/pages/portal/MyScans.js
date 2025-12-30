import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import api from '../../api';
import './MyScans.css';

function MyScans() {
  const [expandedScan, setExpandedScan] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/scans/my');
      // Handle both array and object with data property
      const scansData = Array.isArray(response.data) ? response.data : (response.data?.scans || response.data?.data || []);
      setScans(scansData);
    } catch (err) {
      console.error('Error fetching scans:', err);
      setError('Failed to load your scans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleScan = (id) => {
    setExpandedScan(expandedScan === id ? null : id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <><i className="fas fa-check-circle"></i> Ready</>;
      case 'in-progress':
        return <><i className="fas fa-spinner fa-spin"></i> In Progress</>;
      case 'pending':
      default:
        return <><i className="fas fa-clock"></i> Pending</>;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'ready';
      case 'in-progress':
        return 'in-progress';
      case 'pending':
      default:
        return 'pending';
    }
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="my-scans">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your scans...</p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout>
        <div className="my-scans">
          <div className="error-state">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button onClick={fetchScans} className="retry-btn">
              <i className="fas fa-redo"></i> Try Again
            </button>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="my-scans">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 style={{ color: '#2a1f35' }}>My Energetic Scans</h1>
            <p style={{ color: '#6b5b7a' }}>View your personalized scan reports</p>
          </div>
          <Link to="/book" className="request-btn">
            <i className="fas fa-plus"></i>
            Request New Scan
          </Link>
        </div>

        {/* Info Banner */}
        <div className="info-banner">
          <i className="fas fa-info-circle"></i>
          <p>Energetic scans provide a snapshot of your current state across physical, nervous system, and energetic dimensions. Use these insights to guide your healing focus.</p>
        </div>

        {/* Scans List */}
        <div className="scans-list">
          {scans.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <h3>No scans yet</h3>
              <p>You haven't had any energetic scans. Request your first scan to get personalized insights.</p>
              <Link to="/book" className="empty-action">
                Request a Scan
              </Link>
            </div>
          ) : (
            scans.map((scan) => (
              <div key={scan.id} className={`scan-card ${expandedScan === scan.id ? 'expanded' : ''}`}>
                <div
                  className="scan-header"
                  onClick={() => scan.status === 'completed' && toggleScan(scan.id)}
                  style={{ cursor: scan.status === 'completed' ? 'pointer' : 'default' }}
                >
                  <div className="scan-info">
                    <div className="scan-icon">
                      <i className="fas fa-bolt"></i>
                    </div>
                    <div className="scan-details">
                      <h3>Energetic Scan</h3>
                      <span className="scan-date">
                        <i className="fas fa-calendar"></i>
                        {formatDate(scan.scan_date)}
                      </span>
                    </div>
                  </div>
                  <div className="scan-actions">
                    <span className={`status-badge ${getStatusClass(scan.status)}`}>
                      {getStatusBadge(scan.status)}
                    </span>
                    {scan.status === 'completed' && (
                      <button className="expand-btn">
                        <i className={`fas fa-chevron-${expandedScan === scan.id ? 'up' : 'down'}`}></i>
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Report */}
                {expandedScan === scan.id && scan.status === 'completed' && (
                  <div className="scan-report">
                    {scan.findings && (
                      <div className="report-section">
                        <div className="section-header">
                          <i className="fas fa-search"></i>
                          <h4>Findings</h4>
                        </div>
                        <p className="section-details">{scan.findings}</p>
                      </div>
                    )}

                    {scan.recommendations && (
                      <div className="report-section focus-section">
                        <div className="section-header">
                          <i className="fas fa-star"></i>
                          <h4>Recommendations</h4>
                        </div>
                        <p className="section-details">{scan.recommendations}</p>
                      </div>
                    )}

                    {!scan.findings && !scan.recommendations && (
                      <div className="report-section">
                        <p className="section-details">Detailed report information is not available for this scan.</p>
                      </div>
                    )}

                    <div className="report-disclaimer">
                      <i className="fas fa-exclamation-triangle"></i>
                      <p>This scan is for educational purposes only and does not constitute medical advice. Please consult with healthcare professionals for medical concerns.</p>
                    </div>
                  </div>
                )}

                {scan.status === 'pending' && (
                  <div className="scan-summary">
                    <p>Your scan is being prepared. You'll be notified when it's ready.</p>
                  </div>
                )}

                {scan.status === 'in-progress' && (
                  <div className="scan-summary">
                    <p>Your scan is currently in progress. Check back soon for your results.</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </PortalLayout>
  );
}

export default MyScans;
