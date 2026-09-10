const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

async function getConsumerId(userId) {
  const r = await pool.query('SELECT id FROM consumers WHERE user_id = $1', [userId]);
  return r.rows[0]?.id;
}

// GET /api/cart
router.get('/', authenticate, authorize('consumer'), async (req, res) => {
  const consumerId = await getConsumerId(req.user.id);
  const result = await pool.query(
    `SELECT ci.id AS cart_id, ci.quantity_kg, p.*, u.name AS farmer_name
     FROM cart ci JOIN products p ON ci.product_id = p.id
     JOIN farmers f ON p.farmer_id = f.id JOIN users u ON f.user_id = u.id
     WHERE ci.consumer_id = $1`,
    [consumerId]
  );
  res.json(result.rows);
});

// POST /api/cart
router.post('/', authenticate, authorize('consumer'), async (req, res) => {
  const { productId, quantityKg } = req.body;
  const consumerId = await getConsumerId(req.user.id);
  const existing = await pool.query('SELECT id FROM cart WHERE consumer_id = $1 AND product_id = $2', [consumerId, productId]);
  let result;
  if (existing.rows.length) {
    result = await pool.query('UPDATE cart SET quantity_kg = quantity_kg + $1 WHERE id = $2 RETURNING *', [quantityKg, existing.rows[0].id]);
  } else {
    result = await pool.query('INSERT INTO cart (consumer_id, product_id, quantity_kg) VALUES ($1,$2,$3) RETURNING *', [consumerId, productId, quantityKg]);
  }
  res.status(201).json(result.rows[0]);
});

// PUT /api/cart/:id
router.put('/:id', authenticate, authorize('consumer'), async (req, res) => {
  const { quantityKg } = req.body;
  const result = await pool.query('UPDATE cart SET quantity_kg = $1 WHERE id = $2 RETURNING *', [quantityKg, req.params.id]);
  res.json(result.rows[0]);
});

// DELETE /api/cart/:id
router.delete('/:id', authenticate, authorize('consumer'), async (req, res) => {
  await pool.query('DELETE FROM cart WHERE id = $1', [req.params.id]);
  res.json({ message: 'Removed from cart' });
});

module.exports = router;