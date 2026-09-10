// Runs schema.sql then seed.sql against the configured database.
// Usage: npm run seed
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function run() {
  const schema = fs.readFileSync(path.join(__dirname, '../../database/schema.sql'), 'utf8');
  const seed = fs.readFileSync(path.join(__dirname, '../../database/seed.sql'), 'utf8');

  console.log('Applying schema.sql ...');
  await pool.query(schema);
  console.log('Applying seed.sql ...');
  await pool.query(seed);
  console.log('✅ Database seeded successfully');
  await pool.end();
}

run().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});