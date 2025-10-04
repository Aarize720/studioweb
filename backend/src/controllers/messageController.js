/**
 * Contrôleur pour la messagerie interne
 */

const { query } = require('../config/database');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * @desc    Récupérer tous les messages de l'utilisateur
 * @route   GET /api/messages
 * @access  Private
 */
exports.getMessages = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { type = 'inbox', page = 1, limit = 20 } = req.query;

  const offset = (page - 1) * limit;
  let queryText;
  let countQuery;
  const params = [userId];

  if (type === 'inbox') {
    queryText = `
      SELECT m.*, 
        u.first_name as sender_first_name, 
        u.last_name as sender_last_name,
        u.avatar as sender_avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.recipient_id = $1
      ORDER BY m.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    countQuery = 'SELECT COUNT(*) FROM messages WHERE recipient_id = $1';
  } else if (type === 'sent') {
    queryText = `
      SELECT m.*, 
        u.first_name as recipient_first_name, 
        u.last_name as recipient_last_name,
        u.avatar as recipient_avatar
      FROM messages m
      JOIN users u ON m.recipient_id = u.id
      WHERE m.sender_id = $1
      ORDER BY m.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    countQuery = 'SELECT COUNT(*) FROM messages WHERE sender_id = $1';
  } else {
    throw new AppError('Type de message invalide', 400);
  }

  // Compter le total
  const countResult = await query(countQuery, [userId]);
  const totalCount = parseInt(countResult.rows[0].count);

  // Récupérer les messages
  const result = await query(queryText, [userId, limit, offset]);

  res.json({
    success: true,
    data: result.rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  });
});

/**
 * @desc    Récupérer un message par ID
 * @route   GET /api/messages/:id
 * @access  Private
 */
exports.getMessageById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const result = await query(
    `SELECT m.*, 
      sender.first_name as sender_first_name, 
      sender.last_name as sender_last_name,
      sender.avatar as sender_avatar,
      sender.email as sender_email,
      recipient.first_name as recipient_first_name, 
      recipient.last_name as recipient_last_name,
      recipient.avatar as recipient_avatar,
      recipient.email as recipient_email
    FROM messages m
    JOIN users sender ON m.sender_id = sender.id
    JOIN users recipient ON m.recipient_id = recipient.id
    WHERE m.id = $1 AND (m.sender_id = $2 OR m.recipient_id = $2)`,
    [id, userId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Message non trouvé', 404);
  }

  const message = result.rows[0];

  // Marquer comme lu si c'est le destinataire qui lit
  if (message.recipient_id === userId && !message.is_read) {
    await query(
      'UPDATE messages SET is_read = true, read_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
    message.is_read = true;
    message.read_at = new Date();
  }

  // Récupérer les réponses (messages enfants)
  const repliesResult = await query(
    `SELECT m.*, 
      u.first_name as sender_first_name, 
      u.last_name as sender_last_name,
      u.avatar as sender_avatar
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.parent_id = $1
    ORDER BY m.created_at ASC`,
    [id]
  );

  message.replies = repliesResult.rows;

  res.json({
    success: true,
    data: message,
  });
});

/**
 * @desc    Envoyer un nouveau message
 * @route   POST /api/messages
 * @access  Private
 */
exports.sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user.id;
  const { recipient_id, subject, message, parent_id } = req.body;

  // Vérifier que le destinataire existe
  const recipientCheck = await query(
    'SELECT id, first_name, last_name, email FROM users WHERE id = $1 AND is_active = true',
    [recipient_id]
  );

  if (recipientCheck.rows.length === 0) {
    throw new AppError('Destinataire non trouvé', 404);
  }

  // Si c'est une réponse, vérifier que le message parent existe
  if (parent_id) {
    const parentCheck = await query(
      'SELECT id FROM messages WHERE id = $1 AND (sender_id = $2 OR recipient_id = $2)',
      [parent_id, senderId]
    );

    if (parentCheck.rows.length === 0) {
      throw new AppError('Message parent non trouvé', 404);
    }
  }

  // Créer le message
  const result = await query(
    `INSERT INTO messages (sender_id, recipient_id, subject, message, parent_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [senderId, recipient_id, subject, message, parent_id || null]
  );

  const newMessage = result.rows[0];

  // Envoyer une notification en temps réel via Socket.io
  const io = req.app.get('io');
  if (io) {
    io.to(`user:${recipient_id}`).emit('new_message', {
      id: newMessage.id,
      sender_id: senderId,
      sender_name: `${req.user.first_name} ${req.user.last_name}`,
      subject: subject,
      message: message,
      created_at: newMessage.created_at,
    });
  }

  logger.info(`Message envoyé de ${senderId} à ${recipient_id}`);

  res.status(201).json({
    success: true,
    data: newMessage,
    message: 'Message envoyé avec succès',
  });
});

/**
 * @desc    Marquer un message comme lu
 * @route   PUT /api/messages/:id/read
 * @access  Private
 */
exports.markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const result = await query(
    'UPDATE messages SET is_read = true, read_at = CURRENT_TIMESTAMP WHERE id = $1 AND recipient_id = $2 RETURNING *',
    [id, userId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Message non trouvé', 404);
  }

  res.json({
    success: true,
    data: result.rows[0],
    message: 'Message marqué comme lu',
  });
});

/**
 * @desc    Marquer tous les messages comme lus
 * @route   PUT /api/messages/read-all
 * @access  Private
 */
exports.markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await query(
    'UPDATE messages SET is_read = true, read_at = CURRENT_TIMESTAMP WHERE recipient_id = $1 AND is_read = false',
    [userId]
  );

  res.json({
    success: true,
    message: 'Tous les messages ont été marqués comme lus',
  });
});

/**
 * @desc    Supprimer un message
 * @route   DELETE /api/messages/:id
 * @access  Private
 */
exports.deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const result = await query(
    'DELETE FROM messages WHERE id = $1 AND (sender_id = $2 OR recipient_id = $2) RETURNING *',
    [id, userId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Message non trouvé', 404);
  }

  logger.info(`Message supprimé: ${id} par utilisateur ${userId}`);

  res.json({
    success: true,
    message: 'Message supprimé avec succès',
  });
});

/**
 * @desc    Récupérer le nombre de messages non lus
 * @route   GET /api/messages/unread/count
 * @access  Private
 */
exports.getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await query(
    'SELECT COUNT(*) FROM messages WHERE recipient_id = $1 AND is_read = false',
    [userId]
  );

  res.json({
    success: true,
    data: {
      unreadCount: parseInt(result.rows[0].count),
    },
  });
});

/**
 * @desc    Récupérer la liste des conversations
 * @route   GET /api/messages/conversations
 * @access  Private
 */
exports.getConversations = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await query(
    `SELECT DISTINCT ON (other_user_id)
      other_user_id,
      other_user_name,
      other_user_avatar,
      last_message,
      last_message_date,
      unread_count
    FROM (
      SELECT 
        CASE 
          WHEN m.sender_id = $1 THEN m.recipient_id 
          ELSE m.sender_id 
        END as other_user_id,
        CASE 
          WHEN m.sender_id = $1 THEN recipient.first_name || ' ' || recipient.last_name
          ELSE sender.first_name || ' ' || sender.last_name
        END as other_user_name,
        CASE 
          WHEN m.sender_id = $1 THEN recipient.avatar
          ELSE sender.avatar
        END as other_user_avatar,
        m.message as last_message,
        m.created_at as last_message_date,
        (SELECT COUNT(*) FROM messages 
         WHERE recipient_id = $1 
         AND sender_id = CASE WHEN m.sender_id = $1 THEN m.recipient_id ELSE m.sender_id END
         AND is_read = false) as unread_count
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users recipient ON m.recipient_id = recipient.id
      WHERE m.sender_id = $1 OR m.recipient_id = $1
      ORDER BY m.created_at DESC
    ) conversations
    ORDER BY other_user_id, last_message_date DESC`,
    [userId]
  );

  res.json({
    success: true,
    data: result.rows,
  });
});