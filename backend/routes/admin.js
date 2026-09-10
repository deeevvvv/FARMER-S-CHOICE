const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/stats — platform-wide metrics
router.get('/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    const [farmers, consumers, buyers, products, orders, revenue, activeDeliveries, forecasts] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM farmers'),
      pool.query('SELECT COUNT(*) FROM consumers'),
      pool.query('SELECT COUNT(*) FROM bulk_buyers'),
      pool.query(`SELECT COUNT(*) FROM products WHERE status = 'active'`),
      pool.query('SELECT COUNT(*) FROM orders'),
      pool.query(`SELECT COALESCE(SUM(total_amount),0) AS total FROM orders WHERE status != 'cancelled'`),
      pool.query(`SELECT COUNT(*) FROM orders WHERE status NOT IN ('delivered','cancelled')`),
      pool.query(`SELECT COUNT(*) FROM demand_forecasts WHERE demand_level = 'HIGH'`),
    ]);

    const orderTrend = await pool.query(
      `SELECT DATE_TRUNC('day', created_at)::date AS day, COUNT(*) AS orders, SUM(total_amount) AS revenue
       FROM orders GROUP BY day ORDER BY day DESC LIMIT 14`
    );

    const topCategories = await pool.query(
      `SELECT c.name, COUNT(p.id) AS product_count, SUM(p.quantity_kg) AS total_kg
       FROM products p JOIN categories c ON p.category_id = c.id
       GROUP BY c.name ORDER BY product_count DESC`
    );

    res.json({
      totalFarmers: Number(farmers.rows[0].count),
      totalConsumers: Number(consumers.rows[0].count),
      totalBulkBuyers: Number(buyers.rows[0].count),
      totalProducts: Number(products.rows[0].count),
      totalOrders: Number(orders.rows[0].count),
      totalRevenue: Number(revenue.rows[0].total),
      activeDeliveries: Number(activeDeliveries.rows[0].count),
      highDemandCrops: Number(forecasts.rows[0].count),
      orderTrend: orderTrend.rows,
      topCategories: topCategories.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load admin stats' });
  }
});

// GET /api/admin/users
router.get('/users', authenticate, authorize('admin'), async (req, res) => {
  const result = await pool.query('SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC');
  res.json(result.rows);
});

module.exports = router;