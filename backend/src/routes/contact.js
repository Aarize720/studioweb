const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateContact } = require('../middleware/validation');
const { emailLimiter } = require('../middleware/rateLimiter');

// Public route - submit contact form
router.post('/', emailLimiter, validateContact, asyncHandler(contactController.submitContactForm));

// Protected routes (admin only)
router.get('/', protect, authorize('admin', 'super_admin'), asyncHandler(contactController.getAllMessages));
router.get('/:id', protect, authorize('admin', 'super_admin'), asyncHandler(contactController.getMessageById));
router.put('/:id/status', protect, authorize('admin', 'super_admin'), asyncHandler(contactController.updateMessageStatus));
router.post('/:id/reply', protect, authorize('admin', 'super_admin'), asyncHandler(contactController.replyToMessage));
router.delete('/:id', protect, authorize('admin', 'super_admin'), asyncHandler(contactController.deleteMessage));

module.exports = router;