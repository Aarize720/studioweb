const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// Get all users (admin only)
router.get('/', protect, authorize('admin', 'super_admin'), asyncHandler(async (req, res) => {
  const result = await query('SELECT id, email, first_name, last_name, role, is_active, created_at FROM users ORDER BY created_at DESC');
  res.json({ success: true, data: result.rows });
}));

// Get user profile
router.get('/profile', protect, asyncHandler(async (req, res) => {
  const result = await query('SELECT id, email, first_name, last_name, phone, avatar, role, created_at FROM users WHERE id = $1', [req.user.id]);
  res.json({ success: true, data: result.rows[0] });
}));

// Update user profile
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const { first_name, last_name, phone, avatar } = req.body;
  const result = await query(
    'UPDATE users SET first_name = $1, last_name = $2, phone = $3, avatar = $4 WHERE id = $5 RETURNING id, email, first_name, last_name, phone, avatar',
    [first_name, last_name, phone, avatar, req.user.id]
  );
  res.json({ success: true, message: 'Profil mis à jour', data: result.rows[0] });
}));

// Delete user (admin only)
router.delete('/:id', protect, authorize('admin', 'super_admin'), asyncHandler(async (req, res) => {
  await query('DELETE FROM users WHERE id = $1', [req.params.id]);
  res.json({ success: true, message: 'Utilisateur supprimé' });
}));

module.exports = router;