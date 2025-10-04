const { query } = require('../config/database');
const { sendEmail } = require('../utils/email');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Handle contact form submission
 */
exports.submitContactForm = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  // Save to database
  const result = await query(
    `INSERT INTO contact_messages (name, email, phone, subject, message, status)
     VALUES ($1, $2, $3, $4, $5, 'new')
     RETURNING *`,
    [name, email, phone, subject, message]
  );
  
  const contactMessage = result.rows[0];
  
  // Send email to admins
  try {
    const adminsResult = await query(
      "SELECT email FROM users WHERE role IN ('admin', 'super_admin') AND email_notifications = true"
    );
    
    for (const admin of adminsResult.rows) {
      await sendEmail({
        to: admin.email,
        subject: `Nouveau message de contact: ${subject}`,
        template: 'contact',
        context: {
          name,
          email,
          phone: phone || 'Non fourni',
          subject,
          message,
          messageId: contactMessage.id,
          url: `${process.env.FRONTEND_URL}/admin/messages/${contactMessage.id}`
        }
      });
    }
    
    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: 'Nous avons bien reçu votre message',
      template: 'contact',
      context: {
        name,
        subject,
        message,
        isConfirmation: true
      }
    });
  } catch (error) {
    logger.error('Failed to send contact form emails:', error);
  }
  
  logger.info(`Contact form submitted: ${contactMessage.id}`);
  
  res.status(201).json({
    success: true,
    message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
    data: contactMessage
  });
};

/**
 * Get all contact messages (admin only)
 */
exports.getAllMessages = async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const offset = (page - 1) * limit;
  
  let queryText = `
    SELECT *, COUNT(*) OVER() as total_count
    FROM contact_messages
    WHERE 1=1
  `;
  
  const params = [];
  let paramCount = 1;
  
  if (status) {
    queryText += ` AND status = $${paramCount}`;
    params.push(status);
    paramCount++;
  }
  
  queryText += ` ORDER BY created_at DESC`;
  queryText += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  params.push(limit, offset);
  
  const result = await query(queryText, params);
  
  const totalCount = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
  const totalPages = Math.ceil(totalCount / limit);
  
  res.json({
    success: true,
    data: result.rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
      totalCount
    }
  });
};

/**
 * Get single contact message (admin only)
 */
exports.getMessageById = async (req, res) => {
  const { id } = req.params;
  
  const result = await query('SELECT * FROM contact_messages WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    throw new AppError('Message non trouvé', 404);
  }
  
  // Mark as read if it was new
  if (result.rows[0].status === 'new') {
    await query("UPDATE contact_messages SET status = 'read' WHERE id = $1", [id]);
    result.rows[0].status = 'read';
  }
  
  res.json({ success: true, data: result.rows[0] });
};

/**
 * Update contact message status (admin only)
 */
exports.updateMessageStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const result = await query(
    'UPDATE contact_messages SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  
  if (result.rows.length === 0) {
    throw new AppError('Message non trouvé', 404);
  }
  
  logger.info(`Contact message ${id} status updated to ${status}`);
  
  res.json({ success: true, data: result.rows[0] });
};

/**
 * Delete contact message (admin only)
 */
exports.deleteMessage = async (req, res) => {
  const { id } = req.params;
  
  const result = await query('DELETE FROM contact_messages WHERE id = $1 RETURNING id', [id]);
  
  if (result.rows.length === 0) {
    throw new AppError('Message non trouvé', 404);
  }
  
  logger.info(`Contact message deleted: ${id}`);
  
  res.json({ success: true, message: 'Message supprimé avec succès' });
};

/**
 * Reply to contact message (admin only)
 */
exports.replyToMessage = async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;
  
  // Get original message
  const messageResult = await query('SELECT * FROM contact_messages WHERE id = $1', [id]);
  
  if (messageResult.rows.length === 0) {
    throw new AppError('Message non trouvé', 404);
  }
  
  const originalMessage = messageResult.rows[0];
  
  // Send reply email
  try {
    await sendEmail({
      to: originalMessage.email,
      subject: `Re: ${originalMessage.subject}`,
      template: 'contact',
      context: {
        name: originalMessage.name,
        subject: originalMessage.subject,
        originalMessage: originalMessage.message,
        reply: reply,
        isReply: true
      }
    });
    
    // Update message status
    await query(
      "UPDATE contact_messages SET status = 'replied', replied_at = NOW() WHERE id = $1",
      [id]
    );
    
    logger.info(`Reply sent for contact message: ${id}`);
    
    res.json({
      success: true,
      message: 'Réponse envoyée avec succès'
    });
  } catch (error) {
    logger.error('Failed to send reply email:', error);
    throw new AppError('Erreur lors de l\'envoi de la réponse', 500);
  }
};