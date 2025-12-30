import React, { useState, useRef, useCallback } from 'react';
import api from '../api';
import './AttachmentUpload.css';

// Get base URL for attachment images
const API_BASE = process.env.REACT_APP_API_URL || 'https://soulsirensomatics-production.up.railway.app/api';
const BASE_HOST = API_BASE.replace(/\/api\/?$/, '');

const getAttachmentUrl = (attachment) => {
  console.log('getAttachmentUrl DEBUG:', {
    attachment,
    API_BASE,
    BASE_HOST,
    hasPath: !!attachment.path,
    hasUrl: !!attachment.url
  });

  // Prefer path (new format), construct full URL
  if (attachment.path) {
    const result = `${BASE_HOST}${attachment.path}`;
    console.log('Using path, result:', result);
    return result;
  }
  // For old format with url, extract path and reconstruct with correct host
  if (attachment.url) {
    try {
      const urlObj = new URL(attachment.url);
      const result = `${BASE_HOST}${urlObj.pathname}`;
      console.log('Using url, extracted pathname:', urlObj.pathname, 'result:', result);
      return result;
    } catch (e) {
      console.log('URL parse error:', e, 'returning as-is:', attachment.url);
      return attachment.url;
    }
  }
  console.log('No path or url found, returning empty');
  return '';
};

function AttachmentUpload({ scanId, existingAttachments = [], onUploadComplete, onDelete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImageFile = (type) => {
    return type && type.startsWith('image/');
  };

  const validateFiles = (files) => {
    const validFiles = [];
    const errors = [];

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type`);
      } else if (file.size > maxFileSize) {
        errors.push(`${file.name}: File too large (max 10MB)`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors.join(', '));
    }

    return validFiles;
  };

  const handleFiles = useCallback((files) => {
    setError(null);
    const validFiles = validateFiles(files);

    if (validFiles.length === 0) return;

    // Create previews
    const newPreviews = validFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: isImageFile(file.type) ? URL.createObjectURL(file) : null
    }));

    setPreviews(prev => [...prev, ...newPreviews]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e) => {
    handleFiles(e.target.files);
    e.target.value = ''; // Reset input
  };

  const removePreview = (index) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      if (newPreviews[index].preview) {
        URL.revokeObjectURL(newPreviews[index].preview);
      }
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const uploadFiles = async () => {
    if (previews.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    const formData = new FormData();
    previews.forEach(p => formData.append('files', p.file));

    try {
      const response = await api.post(`/scans/${scanId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      // Clear previews after successful upload
      previews.forEach(p => {
        if (p.preview) URL.revokeObjectURL(p.preview);
      });
      setPreviews([]);

      if (onUploadComplete) {
        onUploadComplete(response.data.attachments);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error?.message || 'Failed to upload files');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteAttachment = async (filename) => {
    if (!window.confirm('Are you sure you want to delete this attachment?')) return;

    try {
      await api.delete(`/scans/${scanId}/attachments/${filename}`);
      if (onDelete) {
        onDelete(filename);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.error?.message || 'Failed to delete attachment');
    }
  };

  return (
    <div className="attachment-upload">
      {/* Existing Attachments */}
      {existingAttachments.length > 0 && (
        <div className="existing-attachments">
          <h4>Current Attachments ({existingAttachments.length})</h4>
          <div className="attachment-list">
            {existingAttachments.map((attachment, index) => (
              <div key={index} className="attachment-card">
                {isImageFile(attachment.type) ? (
                  <div className="attachment-preview">
                    <img src={getAttachmentUrl(attachment)} alt={attachment.originalName} />
                  </div>
                ) : (
                  <div className="attachment-preview pdf">
                    <i className="fas fa-file-pdf"></i>
                  </div>
                )}
                <div className="attachment-details">
                  <span className="attachment-name" title={attachment.originalName}>
                    {attachment.originalName}
                  </span>
                  <span className="attachment-size">{formatFileSize(attachment.size)}</span>
                </div>
                <button
                  className="delete-attachment-btn"
                  onClick={() => deleteAttachment(attachment.filename)}
                  title="Delete attachment"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
          multiple
          hidden
        />
        <div className="drop-zone-content">
          <i className="fas fa-cloud-upload-alt"></i>
          <p>Drag & drop files here or click to browse</p>
          <span className="file-types">JPG, PNG, GIF, WebP, PDF (max 10MB each)</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="upload-error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {/* Previews */}
      {previews.length > 0 && (
        <div className="upload-previews">
          <h4>Files to Upload ({previews.length})</h4>
          <div className="preview-list">
            {previews.map((preview, index) => (
              <div key={index} className="preview-card">
                {preview.preview ? (
                  <div className="preview-image">
                    <img src={preview.preview} alt={preview.name} />
                  </div>
                ) : (
                  <div className="preview-image pdf">
                    <i className="fas fa-file-pdf"></i>
                  </div>
                )}
                <div className="preview-details">
                  <span className="preview-name" title={preview.name}>{preview.name}</span>
                  <span className="preview-size">{formatFileSize(preview.size)}</span>
                </div>
                <button
                  className="remove-preview-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePreview(index);
                  }}
                  title="Remove"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          )}

          {/* Upload Button */}
          <button
            className="upload-btn"
            onClick={uploadFiles}
            disabled={uploading || previews.length === 0}
          >
            {uploading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Uploading...
              </>
            ) : (
              <>
                <i className="fas fa-upload"></i>
                Upload {previews.length} File{previews.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default AttachmentUpload;
