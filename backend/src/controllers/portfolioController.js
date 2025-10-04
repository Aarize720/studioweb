/**
 * Contrôleur pour la gestion du portfolio
 */

const { query } = require('../config/database');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * @desc    Récupérer tous les projets portfolio
 * @route   GET /api/portfolio
 * @access  Public
 */
exports.getAllProjects = asyncHandler(async (req, res) => {
  const { 
    category, 
    is_featured, 
    page = 1, 
    limit = 12,
    search 
  } = req.query;

  const offset = (page - 1) * limit;
  let queryText = 'SELECT * FROM portfolio WHERE is_active = true';
  const params = [];
  let paramCount = 0;

  // Filtrer par catégorie
  if (category) {
    paramCount++;
    queryText += ` AND category = $${paramCount}`;
    params.push(category);
  }

  // Filtrer par featured
  if (is_featured === 'true') {
    queryText += ' AND is_featured = true';
  }

  // Recherche par titre ou description
  if (search) {
    paramCount++;
    queryText += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
    params.push(`%${search}%`);
  }

  // Compter le total
  const countResult = await query(
    queryText.replace('SELECT *', 'SELECT COUNT(*)'),
    params
  );
  const totalCount = parseInt(countResult.rows[0].count);

  // Ajouter pagination et tri
  queryText += ` ORDER BY display_order ASC, created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
  params.push(limit, offset);

  const result = await query(queryText, params);

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
 * @desc    Récupérer un projet par ID ou slug
 * @route   GET /api/portfolio/:id
 * @access  Public
 */
exports.getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Récupérer le projet
  const projectResult = await query(
    'SELECT * FROM portfolio WHERE (id = $1 OR slug = $1) AND is_active = true',
    [id]
  );

  if (projectResult.rows.length === 0) {
    throw new AppError('Projet non trouvé', 404);
  }

  const project = projectResult.rows[0];

  // Récupérer les images du projet
  const imagesResult = await query(
    'SELECT * FROM portfolio_images WHERE portfolio_id = $1 ORDER BY display_order ASC',
    [project.id]
  );

  project.images = imagesResult.rows;

  res.json({
    success: true,
    data: project,
  });
});

/**
 * @desc    Créer un nouveau projet
 * @route   POST /api/portfolio
 * @access  Private/Admin
 */
exports.createProject = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    description,
    short_description,
    client_name,
    project_url,
    category,
    tags,
    featured_image,
    technologies,
    start_date,
    end_date,
    is_featured,
    display_order,
    images,
  } = req.body;

  // Vérifier si le slug existe déjà
  const existingProject = await query(
    'SELECT id FROM portfolio WHERE slug = $1',
    [slug]
  );

  if (existingProject.rows.length > 0) {
    throw new AppError('Un projet avec ce slug existe déjà', 400);
  }

  // Créer le projet
  const result = await query(
    `INSERT INTO portfolio (
      title, slug, description, short_description, client_name, 
      project_url, category, tags, featured_image, technologies,
      start_date, end_date, is_featured, display_order
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *`,
    [
      title,
      slug,
      description,
      short_description,
      client_name,
      project_url,
      category,
      tags || [],
      featured_image,
      technologies || [],
      start_date,
      end_date,
      is_featured || false,
      display_order || 0,
    ]
  );

  const project = result.rows[0];

  // Ajouter les images si fournies
  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      await query(
        'INSERT INTO portfolio_images (portfolio_id, image_url, caption, display_order) VALUES ($1, $2, $3, $4)',
        [project.id, images[i].image_url, images[i].caption || null, i]
      );
    }

    // Récupérer les images créées
    const imagesResult = await query(
      'SELECT * FROM portfolio_images WHERE portfolio_id = $1 ORDER BY display_order ASC',
      [project.id]
    );
    project.images = imagesResult.rows;
  }

  logger.info(`Projet portfolio créé: ${project.id} par admin`);

  res.status(201).json({
    success: true,
    data: project,
    message: 'Projet créé avec succès',
  });
});

/**
 * @desc    Mettre à jour un projet
 * @route   PUT /api/portfolio/:id
 * @access  Private/Admin
 */
exports.updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    slug,
    description,
    short_description,
    client_name,
    project_url,
    category,
    tags,
    featured_image,
    technologies,
    start_date,
    end_date,
    is_featured,
    is_active,
    display_order,
  } = req.body;

  // Vérifier si le projet existe
  const existingProject = await query('SELECT * FROM portfolio WHERE id = $1', [id]);

  if (existingProject.rows.length === 0) {
    throw new AppError('Projet non trouvé', 404);
  }

  // Vérifier si le slug est déjà utilisé par un autre projet
  if (slug && slug !== existingProject.rows[0].slug) {
    const slugCheck = await query(
      'SELECT id FROM portfolio WHERE slug = $1 AND id != $2',
      [slug, id]
    );

    if (slugCheck.rows.length > 0) {
      throw new AppError('Ce slug est déjà utilisé', 400);
    }
  }

  // Mettre à jour le projet
  const result = await query(
    `UPDATE portfolio SET
      title = COALESCE($1, title),
      slug = COALESCE($2, slug),
      description = COALESCE($3, description),
      short_description = COALESCE($4, short_description),
      client_name = COALESCE($5, client_name),
      project_url = COALESCE($6, project_url),
      category = COALESCE($7, category),
      tags = COALESCE($8, tags),
      featured_image = COALESCE($9, featured_image),
      technologies = COALESCE($10, technologies),
      start_date = COALESCE($11, start_date),
      end_date = COALESCE($12, end_date),
      is_featured = COALESCE($13, is_featured),
      is_active = COALESCE($14, is_active),
      display_order = COALESCE($15, display_order),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $16
    RETURNING *`,
    [
      title,
      slug,
      description,
      short_description,
      client_name,
      project_url,
      category,
      tags,
      featured_image,
      technologies,
      start_date,
      end_date,
      is_featured,
      is_active,
      display_order,
      id,
    ]
  );

  // Récupérer les images
  const imagesResult = await query(
    'SELECT * FROM portfolio_images WHERE portfolio_id = $1 ORDER BY display_order ASC',
    [id]
  );

  const project = result.rows[0];
  project.images = imagesResult.rows;

  logger.info(`Projet portfolio mis à jour: ${id}`);

  res.json({
    success: true,
    data: project,
    message: 'Projet mis à jour avec succès',
  });
});

/**
 * @desc    Supprimer un projet
 * @route   DELETE /api/portfolio/:id
 * @access  Private/Admin
 */
exports.deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query('DELETE FROM portfolio WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    throw new AppError('Projet non trouvé', 404);
  }

  logger.info(`Projet portfolio supprimé: ${id}`);

  res.json({
    success: true,
    message: 'Projet supprimé avec succès',
  });
});

/**
 * @desc    Ajouter une image à un projet
 * @route   POST /api/portfolio/:id/images
 * @access  Private/Admin
 */
exports.addProjectImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { image_url, caption, display_order } = req.body;

  // Vérifier si le projet existe
  const projectCheck = await query('SELECT id FROM portfolio WHERE id = $1', [id]);

  if (projectCheck.rows.length === 0) {
    throw new AppError('Projet non trouvé', 404);
  }

  // Ajouter l'image
  const result = await query(
    'INSERT INTO portfolio_images (portfolio_id, image_url, caption, display_order) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, image_url, caption || null, display_order || 0]
  );

  res.status(201).json({
    success: true,
    data: result.rows[0],
    message: 'Image ajoutée avec succès',
  });
});

/**
 * @desc    Supprimer une image d'un projet
 * @route   DELETE /api/portfolio/:id/images/:imageId
 * @access  Private/Admin
 */
exports.deleteProjectImage = asyncHandler(async (req, res) => {
  const { imageId } = req.params;

  const result = await query(
    'DELETE FROM portfolio_images WHERE id = $1 RETURNING *',
    [imageId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Image non trouvée', 404);
  }

  res.json({
    success: true,
    message: 'Image supprimée avec succès',
  });
});

/**
 * @desc    Récupérer les catégories de projets
 * @route   GET /api/portfolio/categories
 * @access  Public
 */
exports.getCategories = asyncHandler(async (req, res) => {
  const result = await query(
    'SELECT DISTINCT category, COUNT(*) as count FROM portfolio WHERE is_active = true GROUP BY category ORDER BY category'
  );

  res.json({
    success: true,
    data: result.rows,
  });
});