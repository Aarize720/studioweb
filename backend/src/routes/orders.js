const express = require('express');
const router = express.Router();
const { query, transaction } = require('../config/database');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { sendOrderConfirmationEmail } = require('../utils/email');

// Get all orders
router.get('/', protect, asyncHandler(async (req, res) => {
  let queryText = 'SELECT * FROM orders';
  const params = [];
  
  if (req.user.role === 'client') {
    queryText += ' WHERE user_id = $1';
    params.push(req.user.id);
  }
  
  queryText += ' ORDER BY created_at DESC';
  const result = await query(queryText, params);
  res.json({ success: true, data: result.rows });
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
  
  sendOrderConfirmationEmail(result).catch(err => console.error(err));
  res.status(201).json({ success: true, message: 'Commande créée', data: result });
}));

// Update order status (admin)
router.put('/:id/status', protect, authorize('admin', 'super_admin'), asyncHandler(async (req, res) => {
  const { status } = req.body;
  const result = await query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]);
  res.json({ success: true, message: 'Statut mis à jour', data: result.rows[0] });
}));

module.exports = router;