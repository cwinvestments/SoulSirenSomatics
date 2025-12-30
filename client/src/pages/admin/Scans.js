import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import AttachmentUpload from '../../components/AttachmentUpload';
import api from '../../api';
import './Scans.css';

function Scans() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedScan, setExpandedScan] = useState(null);
  const [editingNotes, setEditingNotes] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [saving, setSaving] = useState(false);

  const filters = [
    { key: 'all', label: 'All Scans' },
    { key: 'pending', label: 'Pending' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
  ];

  const fetchScans = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/scans/admin/all');
      setScans(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching scans:', err);
      setError('Failed to load scans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in_progress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredScans = scans.filter(scan => {
    if (activeFilter === 'all') return true;
    return scan.status === activeFilter;
  });

  const handleStatusChange = async (scanId, newStatus) => {
    try {
      setSaving(true);
      await api.put(`/scans/${scanId}`, { status: newStatus });
      setScans(prev => prev.map(scan =>
        scan.id === scanId ? { ...scan, status: newStatus } : scan
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const handleExpandScan = (scanId) => {
    if (expandedScan === scanId) {
      setExpandedScan(null);
      setEditingNotes(null);
    } else {
      setExpandedScan(scanId);
      const scan = scans.find(s => s.id === scanId);
      setNotesText(scan?.practitioner_notes || '');
    }
  };

  const handleSaveNotes = async (scanId) => {
    try {
      setSaving(true);
      await api.put(`/scans/${scanId}`, { practitioner_notes: notesText });
      setScans(prev => prev.map(scan =>
        scan.id === scanId ? { ...scan, practitioner_notes: notesText } : scan
      ));
      setEditingNotes(null);
    } catch (err) {
      console.error('Error saving notes:', err);
      alert('Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadComplete = (scanId, newAttachments) => {
    setScans(prev => prev.map(scan => {
      if (scan.id === scanId) {
        const existingAttachments = scan.attachments || [];
        return { ...scan, attachments: [...existingAttachments, ...newAttachments] };
      }
      return scan;
    }));
  };

  const handleDeleteAttachment = (scanId, filename) => {
    setScans(prev => prev.map(scan => {
      if (scan.id === scanId) {
        return {
          ...scan,
          attachments: (scan.attachments || []).filter(a => a.filename !== filename)
        };
      }
      return scan;
    }));
  };

  const countByStatus = (status) => {
    return scans.filter(s => s.status === status).length;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="scans-page">
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading scans...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="scans-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Scan Management</h1>
            <p>View and manage energetic scans</p>
          </div>
          <div className="header-actions">
            <button className="secondary-btn" onClick={fetchScans}>
              <i className="fas fa-sync-alt"></i>
              Refresh
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <i className="fas fa-exclamation-circle"></i>
            {error}
            <button onClick={fetchScans}>Retry</button>
          </div>
        )}

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon total">
              <i className="fas fa-wave-square"></i>
            </div>
            <div className="summary-info">
              <span className="summary-value">{scans.length}</span>
              <span className="summary-label">Total Scans</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon pending">
              <i className="fas fa-clock"></i>
            </div>
            <div className="summary-info">
              <span className="summary-value">{countByStatus('pending')}</span>
              <span className="summary-label">Pending</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon in-progress">
              <i className="fas fa-spinner"></i>
            </div>
            <div className="summary-info">
              <span className="summary-value">{countByStatus('in_progress')}</span>
              <span className="summary-label">In Progress</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon completed">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="summary-info">
              <span className="summary-value">{countByStatus('completed')}</span>
              <span className="summary-label">Completed</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {filters.map((filter) => (
            <button
              key={filter.key}
              className={`filter-tab ${activeFilter === filter.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
              <span className="filter-count">
                {filter.key === 'all' ? scans.length : countByStatus(filter.key)}
              </span>
            </button>
          ))}
        </div>

        {/* Scans List */}
        <div className="scans-list">
          {filteredScans.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-wave-square"></i>
              <p>No scans found</p>
            </div>
          ) : (
            filteredScans.map((scan) => (
              <div key={scan.id} className={`scan-card ${expandedScan === scan.id ? 'expanded' : ''}`}>
                {/* Scan Header */}
                <div className="scan-header" onClick={() => handleExpandScan(scan.id)}>
                  <div className="scan-client">
                    <div className="avatar">
                      {scan.client_name?.split(' ').map(n => n[0]).join('') || '?'}
                    </div>
                    <div className="client-details">
                      <span className="client-name">{scan.client_name || 'Unknown'}</span>
                      <span className="client-email">{scan.client_email}</span>
                    </div>
                  </div>
                  <div className="scan-meta">
                    <span className="scan-date">
                      <i className="fas fa-calendar"></i>
                      {formatDate(scan.scan_date)}
                    </span>
                    <span className={`status-badge ${getStatusClass(scan.status)}`}>
                      {scan.status.replace('_', ' ')}
                    </span>
                    <span className="attachment-count">
                      <i className="fas fa-paperclip"></i>
                      {(scan.attachments || []).length}
                    </span>
                    <i className={`fas fa-chevron-${expandedScan === scan.id ? 'up' : 'down'} expand-icon`}></i>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedScan === scan.id && (
                  <div className="scan-expanded">
                    {/* Status Update */}
                    <div className="scan-section">
                      <h4>Status</h4>
                      <div className="status-selector">
                        {['pending', 'in_progress', 'completed'].map(status => (
                          <button
                            key={status}
                            className={`status-option ${scan.status === status ? 'active' : ''}`}
                            onClick={() => handleStatusChange(scan.id, status)}
                            disabled={saving}
                          >
                            {status.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Practitioner Notes */}
                    <div className="scan-section">
                      <div className="section-header">
                        <h4>Practitioner Notes</h4>
                        {editingNotes !== scan.id ? (
                          <button
                            className="edit-btn"
                            onClick={() => {
                              setEditingNotes(scan.id);
                              setNotesText(scan.practitioner_notes || '');
                            }}
                          >
                            <i className="fas fa-edit"></i>
                            Edit
                          </button>
                        ) : (
                          <div className="edit-actions">
                            <button
                              className="save-btn"
                              onClick={() => handleSaveNotes(scan.id)}
                              disabled={saving}
                            >
                              {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
                              Save
                            </button>
                            <button
                              className="cancel-btn"
                              onClick={() => setEditingNotes(null)}
                              disabled={saving}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                      {editingNotes === scan.id ? (
                        <textarea
                          className="notes-input"
                          value={notesText}
                          onChange={(e) => setNotesText(e.target.value)}
                          placeholder="Add practitioner notes here..."
                          rows={5}
                        />
                      ) : (
                        <div className="notes-display">
                          {scan.practitioner_notes || <span className="no-notes">No notes added yet</span>}
                        </div>
                      )}
                    </div>

                    {/* Attachments */}
                    <div className="scan-section">
                      <h4>Attachments</h4>
                      <AttachmentUpload
                        scanId={scan.id}
                        existingAttachments={scan.attachments || []}
                        onUploadComplete={(newAttachments) => handleUploadComplete(scan.id, newAttachments)}
                        onDelete={(filename) => handleDeleteAttachment(scan.id, filename)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Scans;
