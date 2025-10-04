const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// All stats routes require admin authentication
router.use(protect);
router.use(authorize('admin', 'super_admin'));

// Dashboard statistics
router.get('/dashboard', asyncHandler(statsController.getDashboardStats));

// Sales statistics
router.get('/sales', asyncHandler(statsController.getSalesStats));

// User statistics
router.get('/users', asyncHandler(statsController.getUserStats));

// Product statistics
router.get('/products', asyncHandler(statsController.getProductStats));

// Content statistics
router.get('/content', asyncHandler(statsController.getContentStats));

// Revenue analytics
router.get('/revenue', asyncHandler(statsController.getRevenueAnalytics));

module.exports = router;