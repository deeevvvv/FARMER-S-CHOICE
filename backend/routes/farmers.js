const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/farmers/dashboard — summary stats for the logged-in farmer
router.get('/dashboard', authenticate, authorize('farmer'), async (req, res) => {
  try {
    const farmerResult = await pool.query('SELECT * FROM farmers WHERE user_id = $1', [req.user.id]);
    if (!farmerResult.rows.length) return res.status(404).json({ error: 'Farmer profile not found' });
    const farmer = farmerResult.rows[0];

    const [productsRes, activeOrdersRes, soldRes, salesTrendRes] = await Promise.all([
      pool.query('SELECT * FROM products WHERE farmer_id = $1 ORDER BY created_at DESC', [farmer.id]),
      pool.query(
        `SELECT COUNT(DISTINCT o.id) AS count FROM orders o
         JOIN order_items oi ON oi.order_id = o.id
         WHERE oi.farmer_id = $1 AND o.status NOT IN ('delivered','cancelled')`,
        [farmer.id]
      ),
      pool.query(
        `SELECT COALESCE(SUM(oi.quantity_kg),0) AS total_kg FROM order_items oi
         JOIN orders o ON oi.order_id = o.id WHERE oi.farmer_id = $1 AND o.status = 'delivered'`,
        [farmer.id]
      ),
      pool.query(
        `SELECT DATE_TRUNC('day', o.created_at)::date AS day, SUM(oi.subtotal) AS revenue
         FROM order_items oi JOIN orders o ON oi.order_id = o.id
         WHERE oi.farmer_id = $1 GROUP BY day ORDER BY day DESC LIMIT 14`,
        [farmer.id]
      ),
    ]);

    res.json({
      farmer,
      totalEarnings: Number(farmer.total_earnings),
      activeOrders: Number(activeOrdersRes.rows[0].count),
      availableInventoryKg: productsRes.rows.reduce((s, p) => s + Number(p.quantity_kg), 0),
      productsSoldKg: Number(soldRes.rows[0].total_kg),
      products: productsRes.rows,
      salesTrend: salesTrendRes.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load farmer dashboard' });
  }
});

// GET /api/farmers  — public list (used for matching with bulk requirements)
router.get('/', async (req, res) => {
  const result = await pool.query(
    `SELECT f.*, u.name, u.phone FROM farmers f JOIN users u ON f.user_id = u.id`
  );
  res.json(result.rows);
});

module.exports = router;