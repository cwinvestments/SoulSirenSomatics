const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { pool } = require('../config/database');
const authMiddleware = require('../middleware/auth');
const { sendScanReadyEmail } = require('../utils/email');

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: scanId_timestamp_originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `scan_${req.params.id}_${uniqueSuffix}_${baseName}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images and PDFs
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, and PDF are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Max 5 files per upload
  }
});

// Helper: Check if user is admin
const isAdmin = (user) => user && user.role === 'admin';

// GET /api/scans - Get all scans (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const result = await pool.query(`
      SELECT
        s.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone
      FROM scans s
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.scan_date DESC, s.created_at DESC
    `);

    res.json({ scans: result.rows });
  } catch (error) {
    console.error('Error fetching all scans:', error);
    res.status(500).json({ error: { message: 'Failed to fetch scans' } });
  }
});

// GET /api/scans/my - Get current user's scans (portal)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM scans
      WHERE user_id = $1
      ORDER BY scan_date DESC, created_at DESC
    `, [req.user.id]);

    res.json({ scans: result.rows });
  } catch (error) {
    console.error('Error fetching user scans:', error);
    res.status(500).json({ error: { message: 'Failed to fetch scans' } });
  }
});

// GET /api/scans/:id - Get single scan
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT
        s.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone
      FROM scans s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Scan not found' } });
    }

    const scan = result.rows[0];

    // Check authorization: admin can view any, users can only view their own
    if (!isAdmin(req.user) && scan.user_id !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to view this scan' } });
    }

    res.json({ scan });
  } catch (error) {
    console.error('Error fetching scan:', error);
    res.status(500).json({ error: { message: 'Failed to fetch scan' } });
  }
});

// POST /api/scans - Create new scan (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const { user_id, scan_date, findings, recommendations, status } = req.body;

    // Validate required fields
    if (!user_id || !scan_date) {
      return res.status(400).json({
        error: { message: 'Missing required fields: user_id and scan_date are required' }
      });
    }

    // Validate status if provided
    const validStatuses = ['pending', 'in-progress', 'completed'];
    const scanStatus = status && validStatuses.includes(status) ? status : 'pending';

    // Verify user exists and get their info for email
    const userCheck = await pool.query(
      'SELECT id, email, first_name, last_name FROM users WHERE id = $1',
      [user_id]
    );
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ error: { message: 'User not found' } });
    }

    const user = userCheck.rows[0];

    const result = await pool.query(`
      INSERT INTO scans (user_id, scan_date, findings, recommendations, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [user_id, scan_date, findings || null, recommendations || null, scanStatus]);

    const createdScan = result.rows[0];

    // Send email notification if scan is created as completed
    if (scanStatus === 'completed') {
      try {
        const userName = user.first_name || user.email.split('@')[0];
        await sendScanReadyEmail(user.email, userName, scan_date);
        console.log(`[Scans] Email notification sent for new completed scan ID: ${createdScan.id}`);
      } catch (emailError) {
        // Log error but don't fail the request
        console.error('[Scans] Failed to send email notification:', emailError.message);
      }
    }

    res.status(201).json({
      message: 'Scan created successfully',
      scan: createdScan
    });
  } catch (error) {
    console.error('Error creating scan:', error);
    res.status(500).json({ error: { message: 'Failed to create scan' } });
  }
});

// PUT /api/scans/:id - Update scan (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const { id } = req.params;
    const { findings, recommendations, status } = req.body;

    // Check if scan exists and get current status + user info
    const existingResult = await pool.query(`
      SELECT s.*, u.email, u.first_name, u.last_name
      FROM scans s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.id = $1
    `, [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Scan not found' } });
    }

    const existingScan = existingResult.rows[0];
    const previousStatus = existingScan.status;

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (findings !== undefined) {
      updates.push(`findings = $${paramCount++}`);
      values.push(findings);
    }
    if (recommendations !== undefined) {
      updates.push(`recommendations = $${paramCount++}`);
      values.push(recommendations);
    }
    if (status !== undefined) {
      // Validate status
      const validStatuses = ['pending', 'in-progress', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: { message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }
        });
      }
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: { message: 'No valid fields to update' } });
    }

    // Add updated_at
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    // Add id to values
    values.push(id);

    const result = await pool.query(`
      UPDATE scans
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    const updatedScan = result.rows[0];

    // Send email notification if status changed to completed
    if (status === 'completed' && previousStatus !== 'completed' && existingScan.email) {
      try {
        const userName = existingScan.first_name || existingScan.email.split('@')[0];
        await sendScanReadyEmail(existingScan.email, userName, existingScan.scan_date);
        console.log(`[Scans] Email notification sent for completed scan ID: ${id}`);
      } catch (emailError) {
        // Log error but don't fail the request
        console.error('[Scans] Failed to send email notification:', emailError.message);
      }
    }

    res.json({
      message: 'Scan updated successfully',
      scan: updatedScan
    });
  } catch (error) {
    console.error('Error updating scan:', error);
    res.status(500).json({ error: { message: 'Failed to update scan' } });
  }
});

// DELETE /api/scans/:id - Delete scan (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const { id } = req.params;

    // Check if scan exists
    const existingResult = await pool.query('SELECT * FROM scans WHERE id = $1', [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Scan not found' } });
    }

    await pool.query('DELETE FROM scans WHERE id = $1', [id]);

    res.json({ message: 'Scan deleted successfully' });
  } catch (error) {
    console.error('Error deleting scan:', error);
    res.status(500).json({ error: { message: 'Failed to delete scan' } });
  }
});

// ===== ATTACHMENT ROUTES =====

// POST /api/scans/:id/attachments - Upload attachments (admin only)
router.post('/:id/attachments', authMiddleware, upload.array('files', 5), async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const { id } = req.params;

    // Check if scan exists
    const scanResult = await pool.query('SELECT * FROM scans WHERE id = $1', [id]);
    if (scanResult.rows.length === 0) {
      // Clean up uploaded files if scan not found
      if (req.files) {
        req.files.forEach(file => {
          fs.unlink(file.path, err => {
            if (err) console.error('Error deleting orphaned file:', err);
          });
        });
      }
      return res.status(404).json({ error: { message: 'Scan not found' } });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: { message: 'No files uploaded' } });
    }

    // Get current attachments
    const currentAttachments = scanResult.rows[0].attachments || [];

    // Create attachment records for uploaded files
    const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
    const newAttachments = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      url: `${baseUrl}/api/scans/${id}/attachments/${file.filename}`,
      type: file.mimetype,
      size: file.size,
      uploaded_at: new Date().toISOString()
    }));

    // Update scan with new attachments
    const updatedAttachments = [...currentAttachments, ...newAttachments];
    await pool.query(
      'UPDATE scans SET attachments = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [JSON.stringify(updatedAttachments), id]
    );

    console.log(`[Scans] ${newAttachments.length} attachment(s) uploaded for scan ID: ${id}`);

    res.status(201).json({
      message: 'Attachments uploaded successfully',
      attachments: newAttachments
    });
  } catch (error) {
    console.error('Error uploading attachments:', error);
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting file after error:', err);
        });
      });
    }
    res.status(500).json({ error: { message: 'Failed to upload attachments' } });
  }
});

// GET /api/scans/:id/attachments - Get all attachments for a scan
router.get('/:id/attachments', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Get scan with attachments
    const result = await pool.query('SELECT user_id, attachments FROM scans WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Scan not found' } });
    }

    const scan = result.rows[0];

    // Check authorization: admin can view any, users can only view their own
    if (!isAdmin(req.user) && scan.user_id !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to view this scan' } });
    }

    res.json({ attachments: scan.attachments || [] });
  } catch (error) {
    console.error('Error fetching attachments:', error);
    res.status(500).json({ error: { message: 'Failed to fetch attachments' } });
  }
});

// GET /api/scans/:id/attachments/:filename - Serve attachment file
router.get('/:id/attachments/:filename', authMiddleware, async (req, res) => {
  try {
    const { id, filename } = req.params;

    // Get scan to check authorization
    const result = await pool.query('SELECT user_id, attachments FROM scans WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Scan not found' } });
    }

    const scan = result.rows[0];

    // Check authorization: admin can view any, users can only view their own
    if (!isAdmin(req.user) && scan.user_id !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to view this attachment' } });
    }

    // Verify the filename exists in scan attachments
    const attachments = scan.attachments || [];
    const attachment = attachments.find(a => a.filename === filename);

    if (!attachment) {
      return res.status(404).json({ error: { message: 'Attachment not found' } });
    }

    // Serve the file
    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: { message: 'File not found on server' } });
    }

    // Set content type
    res.setHeader('Content-Type', attachment.type);
    res.setHeader('Content-Disposition', `inline; filename="${attachment.originalName}"`);

    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving attachment:', error);
    res.status(500).json({ error: { message: 'Failed to serve attachment' } });
  }
});

// DELETE /api/scans/:id/attachments/:filename - Delete attachment (admin only)
router.delete('/:id/attachments/:filename', authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const { id, filename } = req.params;

    // Get scan with attachments
    const result = await pool.query('SELECT attachments FROM scans WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Scan not found' } });
    }

    const attachments = result.rows[0].attachments || [];
    const attachmentIndex = attachments.findIndex(a => a.filename === filename);

    if (attachmentIndex === -1) {
      return res.status(404).json({ error: { message: 'Attachment not found' } });
    }

    // Remove from attachments array
    const removedAttachment = attachments.splice(attachmentIndex, 1)[0];

    // Update database
    await pool.query(
      'UPDATE scans SET attachments = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [JSON.stringify(attachments), id]
    );

    // Delete file from disk
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.log(`[Scans] Attachment deleted from scan ID ${id}: ${removedAttachment.originalName}`);

    res.json({
      message: 'Attachment deleted successfully',
      deletedAttachment: removedAttachment
    });
  } catch (error) {
    console.error('Error deleting attachment:', error);
    res.status(500).json({ error: { message: 'Failed to delete attachment' } });
  }
});

// Error handler for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: { message: 'File too large. Maximum size is 10MB.' } });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: { message: 'Too many files. Maximum is 5 files per upload.' } });
    }
    return res.status(400).json({ error: { message: error.message } });
  }
  if (error.message && error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: { message: error.message } });
  }
  next(error);
});

module.exports = router;
