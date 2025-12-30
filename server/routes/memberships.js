const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Helper: Check if user is admin
const isAdmin = (user) => user && user.role === 'admin';

// Valid tiers and statuses
const VALID_TIERS = ['free', 'seeker', 'siren'];
const VALID_STATUSES = ['active', 'cancelled', 'expired'];

// GET /api/memberships - Get all memberships (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const result = await pool.query(`
      SELECT
        m.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone
      FROM memberships m
      LEFT JOIN users u ON m.user_id = u.id
      ORDER BY m.created_at DESC
    `);

    res.json({ memberships: result.rows });
  } catch (error) {
    console.error('Error fetching all memberships:', error);
    res.status(500).json({ error: { message: 'Failed to fetch memberships' } });
  }
});

// GET /api/memberships/my - Get current user's membership (portal)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM memberships
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `, [req.user.id]);

    res.json({ membership: result.rows[0] || null });
  } catch (error) {
    console.error('Error fetching user membership:', error);
    res.status(500).json({ error: { message: 'Failed to fetch membership' } });
  }
});

// GET /api/memberships/:id - Get single membership (admin only)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const { id } = req.params;

    const result = await pool.query(`
      SELECT
        m.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone
      FROM memberships m
      LEFT JOIN users u ON m.user_id = u.id
      WHERE m.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Membership not found' } });
    }

    res.json({ membership: result.rows[0] });
  } catch (error) {
    console.error('Error fetching membership:', error);
    res.status(500).json({ error: { message: 'Failed to fetch membership' } });
  }
});

// POST /api/memberships - Create new membership
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tier, user_id: bodyUserId } = req.body;

    // Validate required fields
    if (!tier) {
      return res.status(400).json({
        error: { message: 'Missing required field: tier is required' }
      });
    }

    // Validate tier
    if (!VALID_TIERS.includes(tier)) {
      return res.status(400).json({
        error: { message: `Invalid tier. Must be one of: ${VALID_TIERS.join(', ')}` }
      });
    }

    // Determine user_id: admin can specify, otherwise use authenticated user
    const userId = isAdmin(req.user) && bodyUserId ? bodyUserId : req.user.id;

    // Verify user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ error: { message: 'User not found' } });
    }

    // Check if user already has an active membership
    const existingMembership = await pool.query(
      'SELECT id FROM memberships WHERE user_id = $1 AND status = $2',
      [userId, 'active']
    );

    if (existingMembership.rows.length > 0) {
      return res.status(400).json({
        error: { message: 'User already has an active membership. Update or cancel the existing one first.' }
      });
    }

    const result = await pool.query(`
      INSERT INTO memberships (user_id, tier, status, start_date)
      VALUES ($1, $2, 'active', CURRENT_TIMESTAMP)
      RETURNING *
    `, [userId, tier]);

    // Also update user's membership_tier field
    await pool.query(
      'UPDATE users SET membership_tier = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [tier, userId]
    );

    res.status(201).json({
      message: 'Membership created successfully',
      membership: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating membership:', error);
    res.status(500).json({ error: { message: 'Failed to create membership' } });
  }
});

// PUT /api/memberships/:id - Update membership (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const { id } = req.params;
    const { tier, status, end_date } = req.body;

    // Check if membership exists
    const existingResult = await pool.query('SELECT * FROM memberships WHERE id = $1', [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Membership not found' } });
    }

    const existingMembership = existingResult.rows[0];

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (tier !== undefined) {
      if (!VALID_TIERS.includes(tier)) {
        return res.status(400).json({
          error: { message: `Invalid tier. Must be one of: ${VALID_TIERS.join(', ')}` }
        });
      }
      updates.push(`tier = $${paramCount++}`);
      values.push(tier);
    }

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          error: { message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` }
        });
      }
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (end_date !== undefined) {
      updates.push(`end_date = $${paramCount++}`);
      values.push(end_date);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: { message: 'No valid fields to update' } });
    }

    // Add updated_at
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    // Add id to values
    values.push(id);

    const result = await pool.query(`
      UPDATE memberships
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    // Update user's membership_tier if tier or status changed
    const updatedMembership = result.rows[0];
    if (tier !== undefined || status !== undefined) {
      const newTier = updatedMembership.status === 'active' ? updatedMembership.tier : null;
      await pool.query(
        'UPDATE users SET membership_tier = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newTier, existingMembership.user_id]
      );
    }

    res.json({
      message: 'Membership updated successfully',
      membership: updatedMembership
    });
  } catch (error) {
    console.error('Error updating membership:', error);
    res.status(500).json({ error: { message: 'Failed to update membership' } });
  }
});

// DELETE /api/memberships/:id - Delete membership (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const { id } = req.params;

    // Check if membership exists and get user_id
    const existingResult = await pool.query('SELECT * FROM memberships WHERE id = $1', [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Membership not found' } });
    }

    const membership = existingResult.rows[0];

    await pool.query('DELETE FROM memberships WHERE id = $1', [id]);

    // Clear user's membership_tier
    await pool.query(
      'UPDATE users SET membership_tier = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [membership.user_id]
    );

    res.json({ message: 'Membership deleted successfully' });
  } catch (error) {
    console.error('Error deleting membership:', error);
    res.status(500).json({ error: { message: 'Failed to delete membership' } });
  }
});

module.exports = router;
