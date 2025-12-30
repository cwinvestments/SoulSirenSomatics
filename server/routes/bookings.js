const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Helper: Check if user is admin
const isAdmin = (user) => user && user.role === 'admin';

// GET /api/bookings - Get all bookings (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const result = await pool.query(`
      SELECT
        b.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      ORDER BY b.date DESC, b.time DESC
    `);

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ error: { message: 'Failed to fetch bookings' } });
  }
});

// GET /api/bookings/my - Get current user's bookings (portal)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM bookings
      WHERE user_id = $1
      ORDER BY date DESC, time DESC
    `, [req.user.id]);

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: { message: 'Failed to fetch bookings' } });
  }
});

// GET /api/bookings/:id - Get single booking
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT
        b.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Booking not found' } });
    }

    const booking = result.rows[0];

    // Check authorization: admin can view any, users can only view their own
    if (!isAdmin(req.user) && booking.user_id !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to view this booking' } });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: { message: 'Failed to fetch booking' } });
  }
});

// POST /api/bookings - Create new booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { service_type, date, time, duration = 60, notes, price = 0, zoom_link } = req.body;

    // Validate required fields
    if (!service_type || !date || !time) {
      return res.status(400).json({
        error: { message: 'Missing required fields: service_type, date, and time are required' }
      });
    }

    // Validate service_type
    const validServices = ['discovery-call', 'support-session', 'energetic-scan'];
    if (!validServices.includes(service_type)) {
      return res.status(400).json({
        error: { message: `Invalid service_type. Must be one of: ${validServices.join(', ')}` }
      });
    }

    const result = await pool.query(`
      INSERT INTO bookings (user_id, service_type, date, time, duration, status, notes, price, zoom_link)
      VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, $8)
      RETURNING *
    `, [req.user.id, service_type, date, time, duration, notes, price, zoom_link]);

    res.status(201).json({
      message: 'Booking created successfully',
      booking: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: { message: 'Failed to create booking' } });
  }
});

// PUT /api/bookings/:id - Update booking
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, status, notes, zoom_link } = req.body;

    // First, get the existing booking to check ownership
    const existingResult = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Booking not found' } });
    }

    const existingBooking = existingResult.rows[0];

    // Check authorization: admin can update any, users can only update their own
    if (!isAdmin(req.user) && existingBooking.user_id !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to update this booking' } });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (date !== undefined) {
      updates.push(`date = $${paramCount++}`);
      values.push(date);
    }
    if (time !== undefined) {
      updates.push(`time = $${paramCount++}`);
      values.push(time);
    }
    if (status !== undefined) {
      // Validate status
      const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: { message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }
        });
      }
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount++}`);
      values.push(notes);
    }
    if (zoom_link !== undefined && isAdmin(req.user)) {
      // Only admin can update zoom_link
      updates.push(`zoom_link = $${paramCount++}`);
      values.push(zoom_link);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: { message: 'No valid fields to update' } });
    }

    // Add updated_at
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    // Add id to values
    values.push(id);

    const result = await pool.query(`
      UPDATE bookings
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    res.json({
      message: 'Booking updated successfully',
      booking: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: { message: 'Failed to update booking' } });
  }
});

// DELETE /api/bookings/:id - Cancel/delete booking
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // First, get the existing booking to check ownership
    const existingResult = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Booking not found' } });
    }

    const existingBooking = existingResult.rows[0];

    // Check authorization: admin can delete any, users can only delete their own
    if (!isAdmin(req.user) && existingBooking.user_id !== req.user.id) {
      return res.status(403).json({ error: { message: 'Not authorized to cancel this booking' } });
    }

    await pool.query('DELETE FROM bookings WHERE id = $1', [id]);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: { message: 'Failed to cancel booking' } });
  }
});

module.exports = router;
