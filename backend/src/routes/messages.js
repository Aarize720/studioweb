const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getMessages,
  getMessageById,
  sendMessage,
  markAsRead,
  markAllAsRead,
  deleteMessage,
  getUnreadCount,
  getConversations,
} = require('../controllers/messageController');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes
router.get('/conversations', getConversations);
router.get('/unread/count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.get('/', getMessages);
router.post('/', sendMessage);
router.get('/:id', getMessageById);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteMessage);

module.exports = router;