/**
 * Routes d'authentification
 */

const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateMe,
  forgotPassword,
  resetPassword,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');
const { authLimiter, emailLimiter } = require('../middleware/rateLimiter');

// Routes publiques
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', emailLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Routes protégées
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/change-password', protect, changePassword);

module.exports = router;