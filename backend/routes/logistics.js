const express = require('express');
const pool = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const TULIP_URL = process.env.TULIP_SERVICE_URL || 'http://localhost:8000';

// GET /api/logistics/overview — active deliveries grouped by area, for the logistics dashboard
router.get('/overview', authenticate, async (req, res) => {
  try {
    const deliveries = await pool.query(
      `SELECT d.*, o.delivery_city, o.delivery_lat, o.delivery_lng, o.status AS order_status, v.vehicle_no, v.driver_name
       FROM deliveries d
       JOIN orders o ON d.order_id = o.id
       LEFT JOIN vehicles v ON d.vehicle_id = v.id
       ORDER BY d.created_at DESC`
    );
    const farmLocations = await pool.query(`SELECT * FROM locations WHERE type IN ('farm','collection_center')`);
    const activeOrders = await pool.query(
      `SELECT id, delivery_city, delivery_lat, delivery_lng, status FROM orders WHERE status NOT IN ('delivered','cancelled')`
    );
    res.json({ deliveries: deliveries.rows, locations: farmLocations.rows, activeOrders: activeOrders.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load logistics overview' });
  }
});

// POST /api/logistics/optimize-route
// body: { stops: [{ label, latitude, longitude, type }], buyer: { label, latitude, longitude } }
// Delegates to the TULIP AI micro-service, which runs the route optimization heuristic.
router.post('/optimize-route', authenticate, async (req, res) => {
  try {
    const response = await fetch(`${TULIP_URL}/optimize-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    if (!response.ok) throw new Error(`TULIP service responded ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('TULIP route optimization failed:', err.message);
    res.status(502).json({ error: 'TULIP route optimization service is unavailable' });
  }
});

module.exports = router;