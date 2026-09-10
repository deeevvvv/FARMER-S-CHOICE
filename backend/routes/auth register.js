const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, phone, role, profile } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'name, email, password and role are required' });
  }
  if (!['farmer', 'consumer', 'bulk_buyer'].includes(role)) {
    return res.status(400).json({ error: 'role must be farmer, consumer, or bulk_buyer' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash, phone, role)
       VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, role`,
      [name, email, passwordHash, phone || null, role]
    );
    const user = userResult.rows[0];

    // Create the role-specific profile row
    if (role === 'farmer') {
      await client.query(
        `INSERT INTO farmers (user_id, farm_name, village, district, state, latitude, longitude, land_size_acres, years_farming)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          user.id,
          profile?.farmName || `${name}'s Farm`,
          profile?.village || null,
          profile?.district || null,
          profile?.state || null,
          profile?.latitude || null,
          profile?.longitude || null,
          profile?.landSizeAcres || null,
          profile?.yearsFarming || null,
        ]
      );
    } else if (role === 'consumer') {
      await client.query(
        `INSERT INTO consumers (user_id, address, city, latitude, longitude) VALUES ($1,$2,$3,$4,$5)`,
        [user.id, profile?.address || null, profile?.city || null, profile?.latitude || null, profile?.longitude || null]
      );
    } else if (role === 'bulk_buyer') {
      await client.query(
        `INSERT INTO bulk_buyers (user_id, business_name, business_type, gst_number, address, city, latitude, longitude)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          user.id,
          profile?.businessName || name,
          profile?.businessType || 'retailer',
          profile?.gstNumber || null,
          profile?.address || null,
          profile?.city || null,
          profile?.latitude || null,
          profile?.longitude || null,
        ]
      );
    }

    await client.query('COMMIT');

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.status(201).json({ token, user });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  } finally {
    client.release();
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!result.rows.length) return res.status(401).json({ error: 'Invalid email or password' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    delete user.password_hash;
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;