const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// POST /api/bulk-requirements — bulk buyer posts a requirement
router.post('/', authenticate, authorize('bulk_buyer'), async (req, res) => {
  const { categoryId, productName, quantityKg, maxPricePerKg, deliveryDate, deliveryLocation } = req.body;
  const buyer = await pool.query('SELECT id FROM bulk_buyers WHERE user_id = $1', [req.user.id]);
  if (!buyer.rows.length) return res.status(404).json({ error: 'Bulk buyer profile not found' });

  const result = await pool.query(
    `INSERT INTO bulk_requirements (bulk_buyer_id, category_id, product_name, quantity_kg, max_price_per_kg, delivery_date, delivery_location)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [buyer.rows[0].id, categoryId, productName, quantityKg, maxPricePerKg, deliveryDate, deliveryLocation]
  );
  res.status(201).json(result.rows[0]);
});

// GET /api/bulk-requirements/mine
router.get('/mine', authenticate, authorize('bulk_buyer'), async (req, res) => {
  const result = await pool.query(
    `SELECT br.* FROM bulk_requirements br JOIN bulk_buyers b ON br.bulk_buyer_id = b.id WHERE b.user_id = $1 ORDER BY br.created_at DESC`,
    [req.user.id]
  );
  res.json(result.rows);
});

// GET /api/bulk-requirements/:id/matches — farmers/products that can fulfil a requirement
router.get('/:id/matches', authenticate, async (req, res) => {
  const req_ = await pool.query('SELECT * FROM bulk_requirements WHERE id = $1', [req.params.id]);
  if (!req_.rows.length) return res.status(404).json({ error: 'Requirement not found' });
  const requirement = req_.rows[0];

  const matches = await pool.query(
    `SELECT p.*, u.name AS farmer_name, f.rating AS farmer_rating, u.phone AS farmer_phone
     FROM products p JOIN farmers f ON p.farmer_id = f.id JOIN users u ON f.user_id = u.id
     WHERE LOWER(p.name) = LOWER($1) AND p.quantity_kg >= $2 AND p.price_per_kg <= $3 AND p.status = 'active'
     ORDER BY p.price_per_kg ASC`,
    [requirement.product_name, requirement.quantity_kg, requirement.max_price_per_kg]
  );
  res.json({ requirement, matches: matches.rows });
});

module.exports = router;