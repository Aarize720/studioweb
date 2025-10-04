/**
 * Contrôleur des produits
 */

const { query } = require('../config/database');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { getCache, setCache, deleteCache } = require('../config/redis');
const slugify = require('slugify');

/**
 * @desc    Obtenir tous les produits
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = asyncHandler(async (req, res) => {
  const { category, is_featured, is_active = 'true', search, page = 1, limit = 12 } = req.query;
  
  const offset = (page - 1) * limit;
  let queryText = 'SELECT * FROM products WHERE 1=1';
  const params = [];
  let paramCount = 1;

  if (category) {
    queryText += ` AND category = $${paramCount}`;
    params.push(category);
    paramCount++;
  }

  if (is_featured) {
    queryText += ` AND is_featured = $${paramCount}`;
    params.push(is_featured === 'true');
    paramCount++;
  }

  if (is_active) {
    queryText += ` AND is_active = $${paramCount}`;
    params.push(is_active === 'true');
    paramCount++;
  }

  if (search) {
    queryText += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
    params.push(`%${search}%`);
    paramCount++;
  }

  // Compter le total
  const countResult = await query(queryText.replace('SELECT *', 'SELECT COUNT(*)'), params);
  const total = parseInt(countResult.rows[0].count);

  // Ajouter pagination
  queryText += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  params.push(limit, offset);

  const result = await query(queryText, params);

  res.json({
    success: true,
    data: result.rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Obtenir un produit par ID ou slug
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Vérifier si c'est un UUID ou un slug
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const field = isUUID ? 'id' : 'slug';

  const result = await query(`SELECT * FROM products WHERE ${field} = $1`, [id]);

  if (result.rows.length === 0) {
    throw new AppError('Produit non trouvé', 404);
  }

  res.json({
    success: true,
    data: result.rows[0],
  });
});

/**
 * @desc    Créer un produit
 * @route   POST /api/products
 * @access  Private/Admin
 */
exports.createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    short_description,
    price,
    compare_at_price,
    sku,
    quantity,
    track_inventory,
    images,
    category,
    tags,
    is_active,
    is_featured,
  } = req.body;

  const slug = slugify(name, { lower: true, strict: true });

  const result = await query(
    `INSERT INTO products (name, slug, description, short_description, price, compare_at_price, 
     sku, quantity, track_inventory, images, category, tags, is_active, is_featured)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     RETURNING *`,
    [
      name,
      slug,
      description,
      short_description,
      price,
      compare_at_price || null,
      sku,
      quantity,
      track_inventory,
      JSON.stringify(images || []),
      category,
      tags || [],
      is_active,
      is_featured,
    ]
  );

  // Invalider le cache
  await deleteCache('products:*');

  res.status(201).json({
    success: true,
    message: 'Produit créé avec succès',
    data: result.rows[0],
  });
});

/**
 * @desc    Mettre à jour un produit
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Vérifier si le produit existe
  const existing = await query('SELECT id FROM products WHERE id = $1', [id]);
  if (existing.rows.length === 0) {
    throw new AppError('Produit non trouvé', 404);
  }

  // Construire la requête de mise à jour
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

  const result = await query(
    `UPDATE products SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );

  // Invalider le cache
  await deleteCache('products:*');

  res.json({
    success: true,
    message: 'Produit mis à jour avec succès',
    data: result.rows[0],
  });
});

/**
 * @desc    Supprimer un produit
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    throw new AppError('Produit non trouvé', 404);
  }

  // Invalider le cache
  await deleteCache('products:*');

  res.json({
    success: true,
    message: 'Produit supprimé avec succès',
  });
});