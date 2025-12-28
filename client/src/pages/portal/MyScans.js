import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../../components/PortalLayout';
import './MyScans.css';

function MyScans() {
  const [expandedScan, setExpandedScan] = useState(null);

  const scans = [
    {
      id: 1,
      date: 'January 15, 2025',
      status: 'ready',
      report: {
        nervousSystem: {
          title: 'Nervous System Status',
          status: 'Hypervigilant / Sympathetic Dominant',
          details: 'Your nervous system is showing signs of chronic stress activation. The fight-or-flight response appears to be your default state, which can manifest as anxiety, difficulty sleeping, or feeling "wired but tired."',
          recommendation: 'Focus on vagal toning exercises and grounding practices.'
        },
        cardiovascular: {
          title: 'Cardiovascular + Vital Energy',
          status: 'Moderate Depletion',
          details: 'Energy reserves are running low. This may be related to the sympathetic dominance affecting your heart rate variability. You may notice fatigue despite adequate sleep.',
          recommendation: 'Gentle movement over intense exercise. Prioritize rest and nourishment.'
        },
        immune: {
          title: 'Immune / Detox Load',
          status: 'Elevated',
          details: 'Your body is working hard to process and eliminate toxins. The lymphatic system could use support. This may contribute to inflammation and sluggishness.',
          recommendation: 'Dry brushing, gentle movement, and adequate hydration will support your lymphatic flow.'
        },
        supportFocus: {
          title: 'Support Focus',
          items: [
            'Nervous system regulation (vagal toning)',
            'Fascia release work, especially around jaw and shoulders',
            'Reduce inflammatory foods temporarily',
            'Create a wind-down routine before bed'
          ]
        }
      }
    },
    {
      id: 2,
      date: 'December 20, 2024',
      status: 'ready',
      report: {
        nervousSystem: {
          title: 'Nervous System Status',
          status: 'Mixed State',
          details: 'Your system is oscillating between sympathetic and parasympathetic states. This can feel like emotional ups and downs or energy fluctuations throughout the day.',
          recommendation: 'Consistency in daily routines will help stabilize your nervous system.'
        },
        cardiovascular: {
          title: 'Cardiovascular + Vital Energy',
          status: 'Building',
          details: 'Energy is slowly rebuilding. Keep nurturing yourself with rest and gentle practices.',
          recommendation: 'Continue with restorative practices. Avoid pushing too hard too fast.'
        },
        immune: {
          title: 'Immune / Detox Load',
          status: 'Moderate',
          details: 'Detox pathways are functioning adequately. Continue supporting with hydration and movement.',
          recommendation: 'Maintain current supportive practices.'
        },
        supportFocus: {
          title: 'Support Focus',
          items: [
            'Establish consistent sleep/wake times',
            'Morning light exposure within 30 min of waking',
            'Afternoon fascia release session',
            'Evening grounding practice'
          ]
        }
      }
    },
    {
      id: 3,
      date: 'November 5, 2024',
      status: 'ready',
      report: null // Older scan, summary only
    }
  ];

  const toggleScan = (id) => {
    setExpandedScan(expandedScan === id ? null : id);
  };

  return (
    <PortalLayout>
      <div className="my-scans">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>My Energetic Scans</h1>
            <p>View your personalized scan reports</p>
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
          {scans.map((scan) => (
            <div key={scan.id} className={`scan-card ${expandedScan === scan.id ? 'expanded' : ''}`}>
              <div className="scan-header" onClick={() => scan.report && toggleScan(scan.id)}>
                <div className="scan-info">
                  <div className="scan-icon">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <div className="scan-details">
                    <h3>Energetic Scan</h3>
                    <span className="scan-date">
                      <i className="fas fa-calendar"></i>
                      {scan.date}
                    </span>
                  </div>
                </div>
                <div className="scan-actions">
                  <span className={`status-badge ${scan.status}`}>
                    {scan.status === 'ready' ? (
                      <><i className="fas fa-check-circle"></i> Ready</>
                    ) : (
                      <><i className="fas fa-clock"></i> Pending</>
                    )}
                  </span>
                  {scan.report && (
                    <button className="expand-btn">
                      <i className={`fas fa-chevron-${expandedScan === scan.id ? 'up' : 'down'}`}></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Report */}
              {expandedScan === scan.id && scan.report && (
                <div className="scan-report">
                  <div className="report-section">
                    <div className="section-header">
                      <i className="fas fa-brain"></i>
                      <h4>{scan.report.nervousSystem.title}</h4>
                    </div>
                    <div className="section-status">{scan.report.nervousSystem.status}</div>
                    <p className="section-details">{scan.report.nervousSystem.details}</p>
                    <div className="section-recommendation">
                      <strong>Recommendation:</strong> {scan.report.nervousSystem.recommendation}
                    </div>
                  </div>

                  <div className="report-section">
                    <div className="section-header">
                      <i className="fas fa-heart"></i>
                      <h4>{scan.report.cardiovascular.title}</h4>
                    </div>
                    <div className="section-status">{scan.report.cardiovascular.status}</div>
                    <p className="section-details">{scan.report.cardiovascular.details}</p>
                    <div className="section-recommendation">
                      <strong>Recommendation:</strong> {scan.report.cardiovascular.recommendation}
                    </div>
                  </div>

                  <div className="report-section">
                    <div className="section-header">
                      <i className="fas fa-shield-alt"></i>
                      <h4>{scan.report.immune.title}</h4>
                    </div>
                    <div className="section-status">{scan.report.immune.status}</div>
                    <p className="section-details">{scan.report.immune.details}</p>
                    <div className="section-recommendation">
                      <strong>Recommendation:</strong> {scan.report.immune.recommendation}
                    </div>
                  </div>

                  <div className="report-section focus-section">
                    <div className="section-header">
                      <i className="fas fa-star"></i>
                      <h4>{scan.report.supportFocus.title}</h4>
                    </div>
                    <ul className="focus-list">
                      {scan.report.supportFocus.items.map((item, index) => (
                        <li key={index}>
                          <i className="fas fa-check"></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="report-disclaimer">
                    <i className="fas fa-exclamation-triangle"></i>
                    <p>This scan is for educational purposes only and does not constitute medical advice. Please consult with healthcare professionals for medical concerns.</p>
                  </div>
                </div>
              )}

              {!scan.report && (
                <div className="scan-summary">
                  <p>Detailed report no longer available. Contact us if you need this information.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

export default MyScans;
