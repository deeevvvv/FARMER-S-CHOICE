require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');
const farmerRoutes = require('./routes/farmers');
const bulkRequirementRoutes = require('./routes/bulkRequirements');
const logisticsRoutes = require('./routes/logistics');
const forecastRoutes = require('./routes/forecasts');
const categoryRoutes = require('./routes/categories');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: "Farmer's Choice API" }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/bulk-requirements', bulkRequirementRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/forecasts', forecastRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌾 Farmer's Choice API running on http://localhost:${PORT}`));