const express = require('express');
const pool = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'picked_up', 'in_transit', 'delivered'];

// POST /api/orders  — checkout (consumer or bulk buyer)
router.post('/', authenticate, async (req, res) => {
  const { items, deliveryAddress, deliveryCity, deliveryLat, deliveryLng, paymentMethod, requestedDate } = req.body;
  // items: [{ productId, quantityKg }]
  if (!items || !items.length) return res.status(400).json({ error: 'Cart is empty' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let buyerType, consumerId = null, bulkBuyerId = null;
    if (req.user.role === 'consumer') {
      const r = await client.query('SELECT id FROM consumers WHERE user_id = $1', [req.user.id]);
      consumerId = r.rows[0]?.id;
      buyerType = 'consumer';
    } else if (req.user.role === 'bulk_buyer') {
      const r = await client.query('SELECT id FROM bulk_buyers WHERE user_id = $1', [req.user.id]);
      bulkBuyerId = r.rows[0]?.id;
      buyerType = 'bulk_buyer';
    } else {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Only consumers and bulk buyers can place orders' });
    }

    let total = 0;
    const itemRows = [];
    for (const item of items) {
      const p = await client.query('SELECT * FROM products WHERE id = $1', [item.productId]);
      if (!p.rows.length) throw new Error(`Product ${item.productId} not found`);
      const product = p.rows[0];
      const subtotal = Number(product.price_per_kg) * Number(item.quantityKg);
      total += subtotal;
      itemRows.push({ productId: product.id, farmerId: product.farmer_id, quantityKg: item.quantityKg, pricePerKg: product.price_per_kg, subtotal });
    }

    const orderResult = await client.query(
      `INSERT INTO orders (buyer_type, consumer_id, bulk_buyer_id, total_amount, delivery_address, delivery_city, delivery_lat, delivery_lng, payment_method, requested_date, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending') RETURNING *`,
      [buyerType, consumerId, bulkBuyerId, total, deliveryAddress, deliveryCity, deliveryLat || null, deliveryLng || null, paymentMethod || 'cod', requestedDate || null]
    );
    const order = orderResult.rows[0];

    for (const row of itemRows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, farmer_id, quantity_kg, price_per_kg, subtotal)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [order.id, row.productId, row.farmerId, row.quantityKg, row.pricePerKg, row.subtotal]
      );
      // reduce inventory
      await client.query('UPDATE products SET quantity_kg = quantity_kg - $1 WHERE id = $2', [row.quantityKg, row.productId]);
    }

    // clear cart if consumer
    if (consumerId) await client.query('DELETE FROM cart WHERE consumer_id = $1', [consumerId]);

    await client.query('COMMIT');
    res.status(201).json({ order, items: itemRows });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to place order' });
  } finally {
    client.release();
  }
});

// GET /api/orders/mine — orders relevant to the logged-in user
router.get('/mine', authenticate, async (req, res) => {
  try {
    let query, params;
    if (req.user.role === 'consumer') {
      query = `SELECT o.* FROM orders o JOIN consumers c ON o.consumer_id = c.id WHERE c.user_id = $1 ORDER BY o.created_at DESC`;
      params = [req.user.id];
    } else if (req.user.role === 'bulk_buyer') {
      query = `SELECT o.* FROM orders o JOIN bulk_buyers b ON o.bulk_buyer_id = b.id WHERE b.user_id = $1 ORDER BY o.created_at DESC`;
      params = [req.user.id];
    } else if (req.user.role === 'farmer') {
      query = `SELECT DISTINCT o.* FROM orders o
               JOIN order_items oi ON oi.order_id = o.id
               JOIN farmers f ON oi.farmer_id = f.id
               WHERE f.user_id = $1 ORDER BY o.created_at DESC`;
      params = [req.user.id];
    } else {
      query = `SELECT * FROM orders ORDER BY created_at DESC`;
      params = [];
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (!order.rows.length) return res.status(404).json({ error: 'Order not found' });
    const items = await pool.query(
      `SELECT oi.*, p.name AS product_name, u.name AS farmer_name
       FROM order_items oi JOIN products p ON oi.product_id = p.id
       JOIN farmers f ON oi.farmer_id = f.id JOIN users u ON f.user_id = u.id
       WHERE oi.order_id = $1`,
      [req.params.id]
    );
    res.json({ ...order.rows[0], items: items.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// PATCH /api/orders/:id/status  — advance order through the pipeline
router.patch('/:id/status', authenticate, async (req, res) => {
  const { status } = req.body;
  if (!STATUS_FLOW.includes(status) && status !== 'cancelled') {
    return res.status(400).json({ error: `status must be one of ${STATUS_FLOW.join(', ')}, cancelled` });
  }
  try {
    const result = await pool.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status, req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;