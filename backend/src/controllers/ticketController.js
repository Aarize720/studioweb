const { query } = require('../config/database');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const { sendEmail } = require('../utils/email');

/**
 * Get all tickets (admin sees all, users see only their own)
 */
exports.getAllTickets = async (req, res) => {
  const { page = 1, limit = 20, status, priority } = req.query;
  const offset = (page - 1) * limit;
  
  let queryText = `
    SELECT t.*, u.first_name, u.last_name, u.email, u.avatar,
           COUNT(*) OVER() as total_count
    FROM tickets t
    JOIN users u ON t.user_id = u.id
    WHERE 1=1
  `;
  
  const params = [];
  let paramCount = 1;
  
  // Non-admin users can only see their own tickets
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    queryText += ` AND t.user_id = $${paramCount}`;
    params.push(req.user.id);
    paramCount++;
  }
  
  if (status) {
    queryText += ` AND t.status = $${paramCount}`;
    params.push(status);
    paramCount++;
  }
  
  if (priority) {
    queryText += ` AND t.priority = $${paramCount}`;
    params.push(priority);
    paramCount++;
  }
  
  queryText += ` ORDER BY 
    CASE t.priority 
      WHEN 'urgent' THEN 1 
      WHEN 'high' THEN 2 
      WHEN 'medium' THEN 3 
      WHEN 'low' THEN 4 
    END,
    t.created_at DESC
  `;
  
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
 * Get single ticket by ID
 */
exports.getTicketById = async (req, res) => {
  const { id } = req.params;
  
  let queryText = `
    SELECT t.*, u.first_name, u.last_name, u.email, u.avatar,
           a.first_name as assigned_first_name, a.last_name as assigned_last_name
    FROM tickets t
    JOIN users u ON t.user_id = u.id
    LEFT JOIN users a ON t.assigned_to = a.id
    WHERE t.id = $1
  `;
  
  const params = [id];
  
  // Non-admin users can only see their own tickets
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    queryText += ` AND t.user_id = $2`;
    params.push(req.user.id);
  }
  
  const result = await query(queryText, params);
  
  if (result.rows.length === 0) {
    throw new AppError('Ticket non trouvé', 404);
  }
  
  const ticket = result.rows[0];
  
  // Get ticket messages
  const messagesResult = await query(`
    SELECT tm.*, u.first_name, u.last_name, u.avatar, u.role
    FROM ticket_messages tm
    JOIN users u ON tm.user_id = u.id
    WHERE tm.ticket_id = $1
    ORDER BY tm.created_at ASC
  `, [id]);
  
  ticket.messages = messagesResult.rows;
  
  res.json({ success: true, data: ticket });
};

/**
 * Create new ticket
 */
exports.createTicket = async (req, res) => {
  const { subject, message, priority, category } = req.body;
  
  // Create ticket
  const ticketResult = await query(
    `INSERT INTO tickets (user_id, subject, priority, category, status)
     VALUES ($1, $2, $3, $4, 'open')
     RETURNING *`,
    [req.user.id, subject, priority || 'medium', category || 'general']
  );
  
  const ticket = ticketResult.rows[0];
  
  // Add initial message
  await query(
    `INSERT INTO ticket_messages (ticket_id, user_id, message, is_staff_reply)
     VALUES ($1, $2, $3, false)`,
    [ticket.id, req.user.id, message]
  );
  
  // Send email notification to admins
  try {
    const adminsResult = await query(
      "SELECT email FROM users WHERE role IN ('admin', 'super_admin') AND email_notifications = true"
    );
    
    for (const admin of adminsResult.rows) {
      await sendEmail({
        to: admin.email,
        subject: `Nouveau ticket: ${subject}`,
        template: 'ticket',
        context: {
          userName: `${req.user.first_name} ${req.user.last_name}`,
          ticketId: ticket.id,
          subject: subject,
          message: message,
          priority: priority || 'medium',
          url: `${process.env.FRONTEND_URL}/admin/tickets/${ticket.id}`
        }
      });
    }
  } catch (error) {
    logger.error('Failed to send ticket notification email:', error);
  }
  
  logger.info(`Ticket created: ${ticket.id} by user ${req.user.id}`);
  
  res.status(201).json({ success: true, data: ticket });
};

/**
 * Update ticket (status, priority, assignment)
 */
exports.updateTicket = async (req, res) => {
  const { id } = req.params;
  const { status, priority, assigned_to, category } = req.body;
  
  // Check if ticket exists and user has permission
  let checkQuery = 'SELECT * FROM tickets WHERE id = $1';
  const checkParams = [id];
  
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    checkQuery += ' AND user_id = $2';
    checkParams.push(req.user.id);
  }
  
  const existingTicket = await query(checkQuery, checkParams);
  
  if (existingTicket.rows.length === 0) {
    throw new AppError('Ticket non trouvé', 404);
  }
  
  // Build update query
  const updates = [];
  const params = [];
  let paramCount = 1;
  
  if (status !== undefined) {
    updates.push(`status = $${paramCount}`);
    params.push(status);
    paramCount++;
    
    // Set closed_at if closing ticket
    if (status === 'closed' && existingTicket.rows[0].status !== 'closed') {
      updates.push(`closed_at = $${paramCount}`);
      params.push(new Date());
      paramCount++;
    }
  }
  
  if (priority !== undefined && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    updates.push(`priority = $${paramCount}`);
    params.push(priority);
    paramCount++;
  }
  
  if (assigned_to !== undefined && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    updates.push(`assigned_to = $${paramCount}`);
    params.push(assigned_to);
    paramCount++;
  }
  
  if (category !== undefined && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    updates.push(`category = $${paramCount}`);
    params.push(category);
    paramCount++;
  }
  
  if (updates.length === 0) {
    throw new AppError('Aucune donnée à mettre à jour', 400);
  }
  
  params.push(id);
  const result = await query(
    `UPDATE tickets SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    params
  );
  
  logger.info(`Ticket updated: ${id} by user ${req.user.id}`);
  
  res.json({ success: true, data: result.rows[0] });
};

/**
 * Add message to ticket
 */
exports.addMessage = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  
  // Check if ticket exists and user has permission
  let checkQuery = 'SELECT t.*, u.email, u.first_name, u.last_name FROM tickets t JOIN users u ON t.user_id = u.id WHERE t.id = $1';
  const checkParams = [id];
  
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    checkQuery += ' AND t.user_id = $2';
    checkParams.push(req.user.id);
  }
  
  const ticketResult = await query(checkQuery, checkParams);
  
  if (ticketResult.rows.length === 0) {
    throw new AppError('Ticket non trouvé', 404);
  }
  
  const ticket = ticketResult.rows[0];
  
  // Check if ticket is closed
  if (ticket.status === 'closed') {
    throw new AppError('Impossible d\'ajouter un message à un ticket fermé', 400);
  }
  
  const isStaffReply = req.user.role === 'admin' || req.user.role === 'super_admin';
  
  // Add message
  const messageResult = await query(
    `INSERT INTO ticket_messages (ticket_id, user_id, message, is_staff_reply)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [id, req.user.id, message, isStaffReply]
  );
  
  // Update ticket status to 'in_progress' if it was 'open'
  if (ticket.status === 'open') {
    await query(
      "UPDATE tickets SET status = 'in_progress' WHERE id = $1",
      [id]
    );
  }
  
  // Send email notification
  try {
    if (isStaffReply) {
      // Notify ticket owner
      await sendEmail({
        to: ticket.email,
        subject: `Réponse à votre ticket: ${ticket.subject}`,
        template: 'ticket',
        context: {
          userName: `${ticket.first_name} ${ticket.last_name}`,
          ticketId: ticket.id,
          subject: ticket.subject,
          message: message,
          isReply: true,
          url: `${process.env.FRONTEND_URL}/client/tickets/${ticket.id}`
        }
      });
    } else {
      // Notify assigned admin or all admins
      let adminQuery = "SELECT email FROM users WHERE role IN ('admin', 'super_admin') AND email_notifications = true";
      const adminParams = [];
      
      if (ticket.assigned_to) {
        adminQuery = "SELECT email FROM users WHERE id = $1 AND email_notifications = true";
        adminParams.push(ticket.assigned_to);
      }
      
      const adminsResult = await query(adminQuery, adminParams);
      
      for (const admin of adminsResult.rows) {
        await sendEmail({
          to: admin.email,
          subject: `Nouveau message sur le ticket: ${ticket.subject}`,
          template: 'ticket',
          context: {
            userName: `${req.user.first_name} ${req.user.last_name}`,
            ticketId: ticket.id,
            subject: ticket.subject,
            message: message,
            isReply: true,
            url: `${process.env.FRONTEND_URL}/admin/tickets/${ticket.id}`
          }
        });
      }
    }
  } catch (error) {
    logger.error('Failed to send ticket message notification:', error);
  }
  
  logger.info(`Message added to ticket ${id} by user ${req.user.id}`);
  
  res.status(201).json({ success: true, data: messageResult.rows[0] });
};

/**
 * Delete ticket (admin only)
 */
exports.deleteTicket = async (req, res) => {
  const { id } = req.params;
  
  const result = await query('DELETE FROM tickets WHERE id = $1 RETURNING id', [id]);
  
  if (result.rows.length === 0) {
    throw new AppError('Ticket non trouvé', 404);
  }
  
  logger.info(`Ticket deleted: ${id} by user ${req.user.id}`);
  
  res.json({ success: true, message: 'Ticket supprimé avec succès' });
};

/**
 * Get ticket statistics (admin only)
 */
exports.getTicketStats = async (req, res) => {
  const stats = {};
  
  // Total tickets
  const totalResult = await query('SELECT COUNT(*) as count FROM tickets');
  stats.total = parseInt(totalResult.rows[0].count);
  
  // By status
  const statusResult = await query(`
    SELECT status, COUNT(*) as count
    FROM tickets
    GROUP BY status
  `);
  stats.byStatus = statusResult.rows.reduce((acc, row) => {
    acc[row.status] = parseInt(row.count);
    return acc;
  }, {});
  
  // By priority
  const priorityResult = await query(`
    SELECT priority, COUNT(*) as count
    FROM tickets
    WHERE status != 'closed'
    GROUP BY priority
  `);
  stats.byPriority = priorityResult.rows.reduce((acc, row) => {
    acc[row.priority] = parseInt(row.count);
    return acc;
  }, {});
  
  // Average response time (time between ticket creation and first staff reply)
  const avgResponseResult = await query(`
    SELECT AVG(EXTRACT(EPOCH FROM (tm.created_at - t.created_at))) as avg_seconds
    FROM tickets t
    JOIN ticket_messages tm ON t.id = tm.ticket_id
    WHERE tm.is_staff_reply = true
    AND tm.id = (
      SELECT MIN(id) FROM ticket_messages
      WHERE ticket_id = t.id AND is_staff_reply = true
    )
  `);
  
  stats.avgResponseTimeMinutes = avgResponseResult.rows[0].avg_seconds 
    ? Math.round(parseFloat(avgResponseResult.rows[0].avg_seconds) / 60) 
    : 0;
  
  res.json({ success: true, data: stats });
};