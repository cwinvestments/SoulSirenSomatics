const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const authMiddleware = require('../middleware/auth');

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

    const { user_id, scan_date, findings, recommendations } = req.body;

    // Validate required fields
    if (!user_id || !scan_date) {
      return res.status(400).json({
        error: { message: 'Missing required fields: user_id and scan_date are required' }
      });
    }

    // Verify user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ error: { message: 'User not found' } });
    }

    const result = await pool.query(`
      INSERT INTO scans (user_id, scan_date, findings, recommendations, status)
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING *
    `, [user_id, scan_date, findings || null, recommendations || null]);

    res.status(201).json({
      message: 'Scan created successfully',
      scan: result.rows[0]
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

    // Check if scan exists
    const existingResult = await pool.query('SELECT * FROM scans WHERE id = $1', [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Scan not found' } });
    }

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

    res.json({
      message: 'Scan updated successfully',
      scan: result.rows[0]
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

module.exports = router;
