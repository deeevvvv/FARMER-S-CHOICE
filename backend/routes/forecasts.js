const express = require('express');
const pool = require('../config/db');

const router = express.Router();
const TULIP_URL = process.env.TULIP_SERVICE_URL || 'http://localhost:8000';

// GET /api/forecasts — latest TULIP demand forecasts (DB cache, refreshed by AI service)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM demand_forecasts ORDER BY forecast_week DESC, pct_change DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch forecasts' });
  }
});

// POST /api/forecasts/refresh — ask TULIP to recompute forecasts from latest order history
router.post('/refresh', async (req, res) => {
  try {
    const response = await fetch(`${TULIP_URL}/forecast/demand`, { method: 'POST' });
    if (!response.ok) throw new Error(`TULIP service responded ${response.status}`);
    const forecasts = await response.json();

    // upsert into cache table
    for (const f of forecasts) {
      await pool.query(
        `INSERT INTO demand_forecasts (product_name, current_demand_kg, predicted_demand_kg, pct_change, demand_level, recommendation, forecast_week)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [f.product_name, f.current_demand_kg, f.predicted_demand_kg, f.pct_change, f.demand_level, f.recommendation, f.forecast_week]
      );
    }
    res.json(forecasts);
  } catch (err) {
    console.error('TULIP forecast refresh failed:', err.message);
    res.status(502).json({ error: 'TULIP forecasting service is unavailable' });
  }
});

module.exports = router;