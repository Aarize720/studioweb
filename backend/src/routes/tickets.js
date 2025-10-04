const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateTicket, validateTicketMessage } = require('../middleware/validation');

// All ticket routes require authentication
router.use(protect);

// Get all tickets (admin sees all, users see their own)
router.get('/', asyncHandler(ticketController.getAllTickets));

// Get ticket statistics (admin only)
router.get('/stats', authorize('admin', 'super_admin'), asyncHandler(ticketController.getTicketStats));

// Get single ticket
router.get('/:id', asyncHandler(ticketController.getTicketById));

// Create new ticket
router.post('/', validateTicket, asyncHandler(ticketController.createTicket));

// Update ticket
router.put('/:id', asyncHandler(ticketController.updateTicket));

// Add message to ticket
router.post('/:id/messages', validateTicketMessage, asyncHandler(ticketController.addMessage));

// Delete ticket (admin only)
router.delete('/:id', authorize('admin', 'super_admin'), asyncHandler(ticketController.deleteTicket));

module.exports = router;