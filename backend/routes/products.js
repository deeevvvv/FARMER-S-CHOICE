const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/products  (marketplace listing with search/filter)
router.get('/', async (req, res) => {
  const { search, category, minPrice, maxPrice, location, sort } = req.query;
  const clauses = [`p.status = 'active'`];
  const params = [];

  if (search) {
    params.push(`%${search.toLowerCase()}%`);
    clauses.push(`LOWER(p.name) LIKE $${params.length}`);
  }
  if (category) {
    params.push(category);
    clauses.push(`c.name = $${params.length}`);
  }
  if (minPrice) {
    params.push(minPrice);
    clauses.push(`p.price_per_kg >= $${params.length}`);
  }
  if (maxPrice) {
    params.push(maxPrice);
    clauses.push(`p.price_per_kg <= $${params.length}`);
  }
  if (location) {
    params.push(`%${location.toLowerCase()}%`);
    clauses.push(`LOWER(p.location) LIKE $${params.length}`);
  }

  let orderBy = 'p.created_at DESC';
  if (sort === 'price_asc') orderBy = 'p.price_per_kg ASC';
  if (sort === 'price_desc') orderBy = 'p.price_per_kg DESC';

  const query = `
    SELECT p.*, c.name AS category_name, c.icon AS category_icon,
           f.farm_name, f.rating AS farmer_rating, u.name AS farmer_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN farmers f ON p.farmer_id = f.id
    JOIN users u ON f.user_id = u.id
    WHERE ${clauses.join(' AND ')}
    ORDER BY ${orderBy}
  `;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name AS category_name, f.farm_name, f.village, f.district,
              f.rating AS farmer_rating, u.name AS farmer_name, u.phone AS farmer_phone
       FROM products p
       JOIN categories c ON p.category_id = c.id
       JOIN farmers f ON p.farmer_id = f.id
       JOIN users u ON f.user_id = u.id
       WHERE p.id = $1`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products  (farmer only)
router.post('/', authenticate, authorize('farmer'), async (req, res) => {
  const { name, categoryId, description, quantityKg, pricePerKg, harvestDate, location, latitude, longitude, imageUrl, isOrganic } = req.body;
  try {
    const farmerResult = await pool.query('SELECT id FROM farmers WHERE user_id = $1', [req.user.id]);
    if (!farmerResult.rows.length) return res.status(404).json({ error: 'Farmer profile not found' });
    const farmerId = farmerResult.rows[0].id;

    const result = await pool.query(
      `INSERT INTO products (farmer_id, category_id, name, description, quantity_kg, price_per_kg, harvest_date, location, latitude, longitude, image_url, is_organic)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [farmerId, categoryId, name, description || null, quantityKg, pricePerKg, harvestDate || null, location || null, latitude || null, longitude || null, imageUrl || null, !!isOrganic]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id  (farmer only, own product)
router.put('/:id', authenticate, authorize('farmer'), async (req, res) => {
  const fields = ['name', 'description', 'quantity_kg', 'price_per_kg', 'harvest_date', 'location', 'image_url', 'is_organic', 'status'];
  const body = req.body;
  const sets = [];
  const params = [];

  fields.forEach((f) => {
    const camel = f.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    if (body[camel] !== undefined) {
      params.push(body[camel]);
      sets.push(`${f} = $${params.length}`);
    }
  });
  if (!sets.length) return res.status(400).json({ error: 'No fields to update' });

  params.push(req.params.id);
  try {
    const result = await pool.query(
      `UPDATE products SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${params.length} RETURNING *`,
      params
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id (farmer only, own product)
router.delete('/:id', authenticate, authorize('farmer'), async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;