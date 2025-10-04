const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM services WHERE is_active = true ORDER BY display_order');
  res.json({ success: true, data: result.rows });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM services WHERE id = $1 OR slug = $1', [req.params.id]);
  res.json({ success: true, data: result.rows[0] });
}));

router.post('/quotes', asyncHandler(async (req, res) => {
  const { service_id, name, email, phone, company, message, budget_range, timeline } = req.body;
  const result = await query(
    'INSERT INTO service_quotes (service_id, name, email, phone, company, message, budget_range, timeline) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [service_id, name, email, phone, company, message, budget_range, timeline]
  );
  res.status(201).json({ success: true, message: 'Demande de devis envoyée', data: result.rows[0] });
}));

router.post('/', protect, authorize('admin', 'super_admin'), asyncHandler(async (req, res) => {
  const { name, slug, description, short_description, price_starting, features } = req.body;
  const result = await query(
    'INSERT INTO services (name, slug, description, short_description, price_starting, features) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, slug, description, short_description, price_starting, JSON.stringify(features)]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
}));

module.exports = router;