const express = require('express');
const router = express.Router();
const { query, transaction } = require('../config/database');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { sendOrderConfirmationEmail } = require('../utils/email');
const logger = require('../utils/logger');

// Get all orders
router.get('/', protect, asyncHandler(async (req, res) => {
  const { limit, sort, status } = req.query;
  
  let queryText = `
    SELECT o.*, 
           u.first_name, u.last_name, u.email as user_email,
           json_build_object(
             'first_name', u.first_name,
             'last_name', u.last_name,
             'email', u.email
           ) as user
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
  `;
  const params = [];
  const conditions = [];
  
  if (req.user.role === 'client') {
    conditions.push(`o.user_id = $${params.length + 1}`);
    params.push(req.user.id);
  }
  
  if (status) {
    conditions.push(`o.status = $${params.length + 1}`);
    params.push(status);
  }
  
  if (conditions.length > 0) {
    queryText += ' WHERE ' + conditions.join(' AND ');
  }
  
  // Sorting
  if (sort) {
    const [field, order] = sort.split(':');
    const validFields = ['created_at', 'total', 'status'];
    const validOrders = ['asc', 'desc'];
    if (validFields.includes(field) && validOrders.includes(order?.toLowerCase())) {
      queryText += ` ORDER BY o.${field} ${order.toUpperCase()}`;
    } else {
      queryText += ' ORDER BY o.created_at DESC';
    }
  } else {
    queryText += ' ORDER BY o.created_at DESC';
  }
  
  // Limit
  if (limit && !isNaN(parseInt(limit))) {
    queryText += ` LIMIT ${parseInt(limit)}`;
  }
  
  const result = await query(queryText, params);
  
  res.json({ 
    success: true, 
    data: {
      orders: result.rows,
      total: result.rows.length
    }
  });
}));

// Get order by ID
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) throw new AppError('Commande non trouvée', 404);
  
  const order = result.rows[0];
  if (req.user.role === 'client' && order.user_id !== req.user.id) {
    throw new AppError('Accès refusé', 403);
  }
  
  const items = await query('SELECT * FROM order_items WHERE order_id = $1', [req.params.id]);
  order.items = items.rows;
  
  res.json({ success: true, data: order });
}));

// Create order
router.post('/', protect, asyncHandler(async (req, res) => {
  const { items, payment_method, ...orderData } = req.body;
  
  const result = await transaction(async (client) => {
    // Calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await client.query('SELECT * FROM products WHERE id = $1', [item.product_id]);
      if (product.rows.length === 0) throw new AppError(`Produit ${item.product_id} non trouvé`, 404);
      
      const p = product.rows[0];
      const itemTotal = p.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        product_id: p.id,
        product_name: p.name,
        product_sku: p.sku,
        quantity: item.quantity,
        price: p.price,
        total: itemTotal,
      });
      
      // Update stock
      if (p.track_inventory) {
        await client.query('UPDATE products SET quantity = quantity - $1 WHERE id = $2', [item.quantity, p.id]);
      }
    }
    
    const tax = subtotal * 0.20; // 20% TVA
    const total = subtotal + tax;
    const orderNumber = `ORD-${Date.now()}`;
    
    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (order_number, user_id, email, first_name, last_name, phone,
       billing_address_line1, billing_city, billing_postal_code, billing_country,
       subtotal, tax, total, payment_method, payment_status, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING *`,
      [orderNumber, req.user.id, orderData.email, orderData.first_name, orderData.last_name, orderData.phone,
       orderData.billing_address_line1, orderData.billing_city, orderData.billing_postal_code, orderData.billing_country,
       subtotal, tax, total, payment_method, 'paid', 'processing']
    );
    
    const order = orderResult.rows[0];
    
    // Create order items
    for (const item of orderItems) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, price, total) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [order.id, item.product_id, item.product_name, item.product_sku, item.quantity, item.price, item.total]
      );
    }
    
    return order;
  });
  
  sendOrderConfirmationEmail(result).catch(err => logger.error('Erreur envoi email confirmation:', err));
  res.status(201).json({ success: true, message: 'Commande créée', data: result });
}));

// Update order status (admin)
router.put('/:id/status', protect, authorize('admin', 'super_admin'), asyncHandler(async (req, res) => {
  const { status } = req.body;
  const result = await query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]);
  res.json({ success: true, message: 'Statut mis à jour', data: result.rows[0] });
}));

module.exports = router;