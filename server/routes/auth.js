const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const authMiddleware = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// POST /api/auth/register - Create new user
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: { message: 'Email, password, first name, and last name are required' }
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: { message: 'User with this email already exists' }
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, email, first_name, last_name, phone, created_at`,
      [email.toLowerCase(), passwordHash, firstName, lastName, phone || null]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email and password are required' }
      });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, email, password_hash, first_name, last_name, phone FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: { message: 'Invalid email or password' }
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        error: { message: 'Invalid email or password' }
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/forgot-password - Send password reset email
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: { message: 'Email is required' }
      });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, email FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    // Always return success to prevent email enumeration
    if (result.rows.length === 0) {
      return res.json({
        message: 'If an account exists with this email, a reset link will be sent'
      });
    }

    const user = result.rows[0];

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, type: 'password-reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // TODO: Store reset token in database with expiration
    // TODO: Send email with reset link
    // const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    // await sendEmail(user.email, 'Password Reset', `Reset your password: ${resetUrl}`);

    res.json({
      message: 'If an account exists with this email, a reset link will be sent'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        error: { message: 'Token and new password are required' }
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        error: { message: 'Invalid or expired reset token' }
      });
    }

    if (decoded.type !== 'password-reset') {
      return res.status(400).json({
        error: { message: 'Invalid reset token' }
      });
    }

    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, decoded.userId]
    );

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me - Get current user (protected)
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, phone, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
