const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Helper: Check if user is admin
const isAdmin = (user) => user && user.role === 'admin';

// Helper: Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Valid statuses
const VALID_STATUSES = ['new', 'read', 'responded', 'archived'];

// POST /api/contact - Submit contact form (public, no auth required)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        error: { message: 'Missing required fields: name, email, and message are required' }
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: { message: 'Invalid email format' }
      });
    }

    // Validate field lengths
    if (name.length > 100) {
      return res.status(400).json({
        error: { message: 'Name must be 100 characters or less' }
      });
    }

    if (message.length > 5000) {
      return res.status(400).json({
        error: { message: 'Message must be 5000 characters or less' }
      });
    }

    const result = await pool.query(`
      INSERT INTO contact_submissions (name, email, subject, message, status)
      VALUES ($1, $2, $3, $4, 'new')
      RETURNING *
    `, [name.trim(), email.trim().toLowerCase(), subject?.trim() || null, message.trim()]);

    // TODO: Send email notification via SendGrid
    // - Notify admin of new contact submission
    // - Send confirmation email to user

    res.status(201).json({
      message: 'Thank you for your message! We will get back to you soon.',
      submission: {
        id: result.rows[0].id,
        created_at: result.rows[0].created_at
      }
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: { message: 'Failed to submit contact form' } });
  }
});

// GET /api/contact - Get all submissions (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const result = await pool.query(`
      SELECT * FROM contact_submissions
      ORDER BY created_at DESC
    `);

    res.json({ submissions: result.rows });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ error: { message: 'Failed to fetch submissions' } });
  }
});

// GET /api/contact/:id - Get single submission (admin only)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM contact_submissions WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Submission not found' } });
    }

    res.json({ submission: result.rows[0] });
  } catch (error) {
    console.error('Error fetching contact submission:', error);
    res.status(500).json({ error: { message: 'Failed to fetch submission' } });
  }
});

// PUT /api/contact/:id - Update submission status (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Check if submission exists
    const existingResult = await pool.query(
      'SELECT * FROM contact_submissions WHERE id = $1',
      [id]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Submission not found' } });
    }

    // Validate status
    if (status === undefined) {
      return res.status(400).json({ error: { message: 'Status is required' } });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: { message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` }
      });
    }

    const result = await pool.query(`
      UPDATE contact_submissions
      SET status = $1
      WHERE id = $2
      RETURNING *
    `, [status, id]);

    res.json({
      message: 'Submission status updated successfully',
      submission: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating contact submission:', error);
    res.status(500).json({ error: { message: 'Failed to update submission' } });
  }
});

// DELETE /api/contact/:id - Delete submission (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const { id } = req.params;

    // Check if submission exists
    const existingResult = await pool.query(
      'SELECT * FROM contact_submissions WHERE id = $1',
      [id]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Submission not found' } });
    }

    await pool.query('DELETE FROM contact_submissions WHERE id = $1', [id]);

    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    res.status(500).json({ error: { message: 'Failed to delete submission' } });
  }
});

module.exports = router;
