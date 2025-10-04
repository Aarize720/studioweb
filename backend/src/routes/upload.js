const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { uploadSingleImage, uploadMultipleImages, handleMulterError } = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimiter');

// All upload routes require authentication
router.use(protect);

// Upload single image
router.post(
  '/image',
  uploadLimiter,
  uploadSingleImage,
  handleMulterError,
  asyncHandler(uploadController.uploadImage)
);

// Upload multiple images
router.post(
  '/images',
  uploadLimiter,
  uploadMultipleImages,
  handleMulterError,
  asyncHandler(uploadController.uploadMultipleImages)
);

// Delete image (admin only)
router.delete(
  '/image',
  authorize('admin', 'super_admin'),
  asyncHandler(uploadController.deleteImage)
);

// Get upload signature for client-side uploads
router.get(
  '/signature',
  asyncHandler(uploadController.getUploadSignature)
);

module.exports = router;