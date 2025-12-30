import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import PortalLayout from '../../components/PortalLayout';
import { usePortalAuth } from '../../context/PortalAuthContext';
import api from '../../api';
import './MyScans.css';

function MyScans() {
  const { user } = usePortalAuth();
  const [expandedScan, setExpandedScan] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedScans, setSelectedScans] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

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

  // Get completed scans for comparison
  const completedScans = useMemo(() => {
    return scans.filter(s => s.status === 'completed');
  }, [scans]);

  // Handle scan selection for comparison
  const toggleScanSelection = (scan) => {
    if (selectedScans.find(s => s.id === scan.id)) {
      setSelectedScans(selectedScans.filter(s => s.id !== scan.id));
    } else if (selectedScans.length < 2) {
      const newSelected = [...selectedScans, scan];
      setSelectedScans(newSelected);
      // Auto-open compare modal when 2 scans are selected
      if (newSelected.length === 2) {
        setShowCompareModal(true);
      }
    }
  };

  // Exit compare mode
  const exitCompareMode = () => {
    setCompareMode(false);
    setSelectedScans([]);
    setShowCompareModal(false);
  };

  // Get comparison data (sorted by date)
  const comparisonData = useMemo(() => {
    if (selectedScans.length !== 2) return null;

    const sorted = [...selectedScans].sort((a, b) =>
      new Date(a.scan_date) - new Date(b.scan_date)
    );

    const daysBetween = Math.ceil(
      (new Date(sorted[1].scan_date) - new Date(sorted[0].scan_date)) / (1000 * 60 * 60 * 24)
    );

    return {
      earlier: sorted[0],
      later: sorted[1],
      daysBetween
    };
  }, [selectedScans]);

  // Compute scan statistics
  const scanStats = useMemo(() => {
    if (!scans || scans.length === 0) return null;

    const completedScans = scans.filter(s => s.status === 'completed');
    const sortedScans = [...scans].sort((a, b) => new Date(a.scan_date) - new Date(b.scan_date));
    const firstScan = sortedScans[0];
    const lastScan = sortedScans[sortedScans.length - 1];

    // Calculate average days between scans
    let avgDaysBetween = null;
    if (sortedScans.length >= 2) {
      const firstDate = new Date(firstScan.scan_date);
      const lastDate = new Date(lastScan.scan_date);
      const totalDays = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24));
      avgDaysBetween = Math.round(totalDays / (sortedScans.length - 1));
    }

    return {
      total: scans.length,
      completed: completedScans.length,
      firstScanDate: firstScan?.scan_date,
      lastScanDate: lastScan?.scan_date,
      avgDaysBetween
    };
  }, [scans]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (scans.length < 2) return [];

    const sortedScans = [...scans].sort((a, b) => new Date(a.scan_date) - new Date(b.scan_date));

    return sortedScans.map((scan, index) => ({
      date: new Date(scan.scan_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: formatDate(scan.scan_date),
      scanNumber: index + 1,
      status: scan.status,
      id: scan.id
    }));
  }, [scans]);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-date">{data.fullDate}</p>
          <p className="tooltip-status">
            Status: <span className={`status-text ${data.status}`}>
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </span>
          </p>
          <p className="tooltip-number">Scan #{data.scanNumber}</p>
        </div>
      );
    }
    return null;
  };

  const downloadPDF = (scan) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = 20;

    // Brand colors
    const deepPurple = [26, 18, 37];
    const gold = [212, 175, 125];
    const lightPurple = [107, 91, 122];

    // Header background
    doc.setFillColor(...deepPurple);
    doc.rect(0, 0, pageWidth, 50, 'F');

    // Gold accent line
    doc.setFillColor(...gold);
    doc.rect(0, 50, pageWidth, 3, 'F');

    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Soul Siren Somatics', pageWidth / 2, 25, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Energetic Scan Report', pageWidth / 2, 38, { align: 'center' });

    yPosition = 70;

    // Client info section
    doc.setTextColor(...deepPurple);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Client:', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    const clientName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Client';
    doc.text(clientName || 'Client', margin + 25, yPosition);

    yPosition += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDate(scan.scan_date), margin + 25, yPosition);

    yPosition += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Status:', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(scan.status.charAt(0).toUpperCase() + scan.status.slice(1), margin + 25, yPosition);

    // Divider line
    yPosition += 15;
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);

    yPosition += 15;

    // Findings section
    if (scan.findings) {
      doc.setTextColor(...gold);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Findings', margin, yPosition);

      yPosition += 10;
      doc.setTextColor(...lightPurple);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      // Split text into lines that fit the page width
      const findingsLines = doc.splitTextToSize(scan.findings, contentWidth);
      findingsLines.forEach((line) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += 6;
      });

      yPosition += 10;
    }

    // Recommendations section
    if (scan.recommendations) {
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setTextColor(...gold);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Recommendations', margin, yPosition);

      yPosition += 10;
      doc.setTextColor(...lightPurple);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const recommendationsLines = doc.splitTextToSize(scan.recommendations, contentWidth);
      recommendationsLines.forEach((line) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += 6;
      });

      yPosition += 10;
    }

    // Disclaimer
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }

    yPosition += 10;
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.3);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);

    yPosition += 10;
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    const disclaimer = 'This scan is for educational purposes only and does not constitute medical advice. Please consult with healthcare professionals for medical concerns.';
    const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);
    disclaimerLines.forEach((line) => {
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(...deepPurple);
      doc.rect(0, 282, pageWidth, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('www.soulsirensomatics.com', pageWidth / 2, 290, { align: 'center' });
    }

    // Save the PDF
    const fileName = `SoulSiren_Scan_${formatDate(scan.scan_date).replace(/,?\s+/g, '_')}.pdf`;
    doc.save(fileName);
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
          <div className="header-actions">
            {completedScans.length >= 2 && !compareMode && (
              <button
                className="compare-btn"
                onClick={() => setCompareMode(true)}
              >
                <i className="fas fa-columns"></i>
                Compare Scans
              </button>
            )}
            {compareMode && (
              <button
                className="cancel-compare-btn"
                onClick={exitCompareMode}
              >
                <i className="fas fa-times"></i>
                Cancel Compare
              </button>
            )}
            <Link to="/book" className="request-btn">
              <i className="fas fa-plus"></i>
              Request New Scan
            </Link>
          </div>
        </div>

        {/* Compare Mode Banner */}
        {compareMode && (
          <div className="compare-mode-banner">
            <i className="fas fa-info-circle"></i>
            <p>
              Select 2 completed scans to compare.
              <strong> {selectedScans.length}/2 selected</strong>
            </p>
          </div>
        )}

        {/* Info Banner */}
        <div className="info-banner">
          <i className="fas fa-info-circle"></i>
          <p>Energetic scans provide a snapshot of your current state across physical, nervous system, and energetic dimensions. Use these insights to guide your healing focus.</p>
        </div>

        {/* Progress Overview - Only show if user has scans */}
        {scanStats && (
          <div className="progress-section">
            <div className="progress-header">
              <h2><i className="fas fa-chart-line"></i> Your Healing Journey</h2>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{scanStats.completed || 0}</div>
                  <div className="stat-label">Completed Scans</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon calendar">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-value">
                    {scanStats.firstScanDate
                      ? new Date(scanStats.firstScanDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : '-'}
                  </div>
                  <div className="stat-label">First Scan</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon recent">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-value">
                    {scanStats.lastScanDate
                      ? new Date(scanStats.lastScanDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : '-'}
                  </div>
                  <div className="stat-label">Most Recent</div>
                </div>
              </div>

              {scanStats.avgDaysBetween !== null && scanStats.avgDaysBetween > 0 && (
                <div className="stat-card">
                  <div className="stat-icon avg">
                    <i className="fas fa-hourglass-half"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{scanStats.avgDaysBetween} days</div>
                    <div className="stat-label">Avg. Between Scans</div>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline Chart - Only show if 2+ scans */}
            {chartData.length >= 2 && (
              <div className="chart-container">
                <h3><i className="fas fa-history"></i> Scan Timeline</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b5b7a', fontSize: 12 }}
                      />
                      <YAxis
                        dataKey="scanNumber"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b5b7a', fontSize: 12 }}
                        domain={[0, 'dataMax + 1']}
                        allowDecimals={false}
                        label={{ value: 'Scan #', angle: -90, position: 'insideLeft', fill: '#6b5b7a', fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="scanNumber"
                        stroke="#9b7bb8"
                        strokeWidth={3}
                        dot={{ fill: '#d4af7d', stroke: '#d4af7d', strokeWidth: 2, r: 6 }}
                        activeDot={{ fill: '#d4af7d', stroke: '#fff', strokeWidth: 2, r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

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
            scans.map((scan) => {
              const isSelected = selectedScans.find(s => s.id === scan.id);
              const isSelectable = compareMode && scan.status === 'completed';

              return (
              <div
                key={scan.id}
                className={`scan-card ${expandedScan === scan.id ? 'expanded' : ''} ${isSelected ? 'selected' : ''} ${isSelectable ? 'selectable' : ''}`}
              >
                <div
                  className="scan-header"
                  onClick={() => {
                    if (compareMode && scan.status === 'completed') {
                      toggleScanSelection(scan);
                    } else if (scan.status === 'completed') {
                      toggleScan(scan.id);
                    }
                  }}
                  style={{ cursor: scan.status === 'completed' ? 'pointer' : 'default' }}
                >
                  {/* Selection Checkbox */}
                  {compareMode && scan.status === 'completed' && (
                    <div className={`selection-checkbox ${isSelected ? 'checked' : ''}`}>
                      {isSelected && <i className="fas fa-check"></i>}
                    </div>
                  )}
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
                    {scan.status === 'completed' && !compareMode && (
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

                    <div className="report-actions">
                      <button
                        className="download-pdf-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadPDF(scan);
                        }}
                      >
                        <i className="fas fa-file-pdf"></i>
                        Download PDF
                      </button>
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
              );
            })
          )}
        </div>

        {/* Comparison Modal */}
        {showCompareModal && comparisonData && (
          <div className="compare-modal-overlay" onClick={() => setShowCompareModal(false)}>
            <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
              <div className="compare-modal-header">
                <div className="compare-header-content">
                  <h2><i className="fas fa-columns"></i> Scan Comparison</h2>
                  <p className="time-between">
                    <i className="fas fa-clock"></i>
                    {comparisonData.daysBetween} days between scans
                  </p>
                </div>
                <button className="close-modal-btn" onClick={exitCompareMode}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="compare-content">
                {/* Earlier Scan */}
                <div className="compare-side earlier">
                  <div className="compare-side-header">
                    <span className="compare-label">Earlier Scan</span>
                    <span className="compare-date">{formatDate(comparisonData.earlier.scan_date)}</span>
                  </div>

                  <div className="compare-section">
                    <h4><i className="fas fa-search"></i> Findings</h4>
                    <p>{comparisonData.earlier.findings || 'No findings recorded'}</p>
                  </div>

                  <div className="compare-section">
                    <h4><i className="fas fa-star"></i> Recommendations</h4>
                    <p>{comparisonData.earlier.recommendations || 'No recommendations recorded'}</p>
                  </div>
                </div>

                {/* Comparison Divider */}
                <div className="compare-divider">
                  <div className="divider-line"></div>
                  <div className="divider-icon">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                  <div className="divider-line"></div>
                </div>

                {/* Later Scan */}
                <div className="compare-side later">
                  <div className="compare-side-header">
                    <span className="compare-label">Later Scan</span>
                    <span className="compare-date">{formatDate(comparisonData.later.scan_date)}</span>
                  </div>

                  <div className="compare-section">
                    <h4><i className="fas fa-search"></i> Findings</h4>
                    <p>{comparisonData.later.findings || 'No findings recorded'}</p>
                  </div>

                  <div className="compare-section">
                    <h4><i className="fas fa-star"></i> Recommendations</h4>
                    <p>{comparisonData.later.recommendations || 'No recommendations recorded'}</p>
                  </div>
                </div>
              </div>

              <div className="compare-modal-footer">
                <p className="compare-disclaimer">
                  <i className="fas fa-info-circle"></i>
                  Use this comparison to track your healing progress over time.
                </p>
                <button className="close-compare-btn" onClick={exitCompareMode}>
                  Close Comparison
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

export default MyScans;
