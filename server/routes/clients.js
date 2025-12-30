const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Helper: Check if user is admin
const isAdmin = (user) => user && user.role === 'admin';

// Admin check middleware
const adminOnly = (req, res, next) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ error: { message: 'Admin access required' } });
  }
  next();
};

// GET /api/clients - Get all clients (admin only)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.membership_tier,
        u.created_at,
        u.updated_at,
        COUNT(DISTINCT b.id) as booking_count,
        COUNT(DISTINCT s.id) as scan_count
      FROM users u
      LEFT JOIN bookings b ON u.id = b.user_id
      LEFT JOIN scans s ON u.id = s.user_id
      WHERE u.role = 'client'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    res.json({ clients: result.rows });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: { message: 'Failed to fetch clients' } });
  }
});

// GET /api/clients/:id - Get single client with details (admin only)
router.get('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Get client info
    const clientResult = await pool.query(`
      SELECT
        id,
        email,
        first_name,
        last_name,
        phone,
        membership_tier,
        created_at,
        updated_at
      FROM users
      WHERE id = $1 AND role = 'client'
    `, [id]);

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Client not found' } });
    }

    const client = clientResult.rows[0];

    // Get bookings
    const bookingsResult = await pool.query(`
      SELECT * FROM bookings
      WHERE user_id = $1
      ORDER BY date DESC, time DESC
    `, [id]);

    // Get scans
    const scansResult = await pool.query(`
      SELECT * FROM scans
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [id]);

    // Get membership
    const membershipResult = await pool.query(`
      SELECT * FROM memberships
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `, [id]);

    res.json({
      client: {
        ...client,
        bookings: bookingsResult.rows,
        scans: scansResult.rows,
        membership: membershipResult.rows[0] || null
      }
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: { message: 'Failed to fetch client' } });
  }
});

// GET /api/clients/:id/bookings - Get client's bookings (admin only)
router.get('/:id/bookings', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify client exists
    const clientCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1 AND role = $2',
      [id, 'client']
    );

    if (clientCheck.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Client not found' } });
    }

    const result = await pool.query(`
      SELECT * FROM bookings
      WHERE user_id = $1
      ORDER BY date DESC, time DESC
    `, [id]);

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Error fetching client bookings:', error);
    res.status(500).json({ error: { message: 'Failed to fetch client bookings' } });
  }
});

// GET /api/clients/:id/scans - Get client's scans (admin only)
router.get('/:id/scans', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify client exists
    const clientCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1 AND role = $2',
      [id, 'client']
    );

    if (clientCheck.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Client not found' } });
    }

    const result = await pool.query(`
      SELECT * FROM scans
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [id]);

    res.json({ scans: result.rows });
  } catch (error) {
    console.error('Error fetching client scans:', error);
    res.status(500).json({ error: { message: 'Failed to fetch client scans' } });
  }
});

// PUT /api/clients/:id - Update client info (admin only)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, membership_tier } = req.body;

    // Check if client exists
    const existingResult = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND role = $2',
      [id, 'client']
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Client not found' } });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (first_name !== undefined) {
      updates.push(`first_name = $${paramCount++}`);
      values.push(first_name);
    }
    if (last_name !== undefined) {
      updates.push(`last_name = $${paramCount++}`);
      values.push(last_name);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramCount++}`);
      values.push(phone);
    }
    if (membership_tier !== undefined) {
      // Validate membership_tier
      const validTiers = ['free', 'seeker', 'siren', null];
      if (!validTiers.includes(membership_tier)) {
        return res.status(400).json({
          error: { message: 'Invalid membership_tier. Must be one of: free, seeker, siren, or null' }
        });
      }
      updates.push(`membership_tier = $${paramCount++}`);
      values.push(membership_tier);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: { message: 'No valid fields to update' } });
    }

    // Add updated_at
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    // Add id to values
    values.push(id);

    const result = await pool.query(`
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, first_name, last_name, phone, membership_tier, created_at, updated_at
    `, values);

    res.json({
      message: 'Client updated successfully',
      client: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: { message: 'Failed to update client' } });
  }
});

// DELETE /api/clients/:id - Delete client (admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists and is a client (not admin)
    const existingResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    const user = existingResult.rows[0];

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({ error: { message: 'Cannot delete admin users' } });
    }

    // Delete user (CASCADE will handle related records)
    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: { message: 'Failed to delete client' } });
  }
});

module.exports = router;
