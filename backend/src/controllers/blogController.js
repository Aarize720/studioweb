const { query } = require('../config/database');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Get all blog posts with pagination and filters
 */
exports.getAllPosts = async (req, res) => {
  const { page = 1, limit = 10, category, tag, search, status = 'published' } = req.query;
  const offset = (page - 1) * limit;
  
  let queryText = `
    SELECT bp.*, bc.name as category_name, bc.slug as category_slug,
           u.first_name, u.last_name, u.avatar,
           COUNT(*) OVER() as total_count
    FROM blog_posts bp 
    LEFT JOIN blog_categories bc ON bp.category_id = bc.id
    LEFT JOIN users u ON bp.author_id = u.id
    WHERE 1=1
  `;
  
  const params = [];
  let paramCount = 1;
  
  // Filter by status (only admins can see drafts)
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    if (status) {
      queryText += ` AND bp.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
  } else {
    queryText += ` AND bp.status = 'published'`;
  }
  
  // Filter by category
  if (category) {
    queryText += ` AND bc.slug = $${paramCount}`;
    params.push(category);
    paramCount++;
  }
  
  // Filter by tag
  if (tag) {
    queryText += ` AND EXISTS (
      SELECT 1 FROM blog_post_tags bpt
      JOIN blog_tags bt ON bpt.tag_id = bt.id
      WHERE bpt.post_id = bp.id AND bt.slug = $${paramCount}
    )`;
    params.push(tag);
    paramCount++;
  }
  
  // Search in title and content
  if (search) {
    queryText += ` AND (bp.title ILIKE $${paramCount} OR bp.content ILIKE $${paramCount} OR bp.excerpt ILIKE $${paramCount})`;
    params.push(`%${search}%`);
    paramCount++;
  }
  
  queryText += ` ORDER BY bp.published_at DESC NULLS LAST, bp.created_at DESC`;
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
 * Get single blog post by slug
 */
exports.getPostBySlug = async (req, res) => {
  const { slug } = req.params;
  
  const result = await query(`
    SELECT bp.*, bc.name as category_name, bc.slug as category_slug,
           u.first_name, u.last_name, u.avatar, u.email
    FROM blog_posts bp 
    LEFT JOIN blog_categories bc ON bp.category_id = bc.id
    LEFT JOIN users u ON bp.author_id = u.id
    WHERE bp.slug = $1
  `, [slug]);
  
  if (result.rows.length === 0) {
    throw new AppError('Article non trouvé', 404);
  }
  
  const post = result.rows[0];
  
  // Check if user can view draft posts
  if (post.status !== 'published') {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin' && req.user.id !== post.author_id)) {
      throw new AppError('Article non trouvé', 404);
    }
  }
  
  // Increment views count
  await query('UPDATE blog_posts SET views = views + 1 WHERE id = $1', [post.id]);
  post.views = (post.views || 0) + 1;
  
  // Get tags
  const tagsResult = await query(`
    SELECT bt.id, bt.name, bt.slug
    FROM blog_tags bt
    JOIN blog_post_tags bpt ON bt.id = bpt.tag_id
    WHERE bpt.post_id = $1
  `, [post.id]);
  
  post.tags = tagsResult.rows;
  
  // Get related posts (same category, exclude current)
  const relatedResult = await query(`
    SELECT bp.id, bp.title, bp.slug, bp.excerpt, bp.featured_image, bp.published_at
    FROM blog_posts bp
    WHERE bp.category_id = $1 AND bp.id != $2 AND bp.status = 'published'
    ORDER BY bp.published_at DESC
    LIMIT 3
  `, [post.category_id, post.id]);
  
  post.related_posts = relatedResult.rows;
  
  res.json({ success: true, data: post });
};

/**
 * Create new blog post
 */
exports.createPost = async (req, res) => {
  const { title, slug, excerpt, content, featured_image, category_id, status, is_featured, tags } = req.body;
  
  // Check if slug already exists
  const existingPost = await query('SELECT id FROM blog_posts WHERE slug = $1', [slug]);
  if (existingPost.rows.length > 0) {
    throw new AppError('Ce slug existe déjà', 400);
  }
  
  // Create post
  const result = await query(
    `INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, category_id, author_id, status, is_featured, published_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      title,
      slug,
      excerpt,
      content,
      featured_image,
      category_id,
      req.user.id,
      status || 'draft',
      is_featured || false,
      status === 'published' ? new Date() : null
    ]
  );
  
  const post = result.rows[0];
  
  // Add tags if provided
  if (tags && Array.isArray(tags) && tags.length > 0) {
    for (const tagId of tags) {
      await query(
        'INSERT INTO blog_post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [post.id, tagId]
      );
    }
  }
  
  logger.info(`Blog post created: ${post.id} by user ${req.user.id}`);
  
  res.status(201).json({ success: true, data: post });
};

/**
 * Update blog post
 */
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, slug, excerpt, content, featured_image, category_id, status, is_featured, tags } = req.body;
  
  // Check if post exists
  const existingPost = await query('SELECT * FROM blog_posts WHERE id = $1', [id]);
  if (existingPost.rows.length === 0) {
    throw new AppError('Article non trouvé', 404);
  }
  
  // Check if slug is taken by another post
  if (slug && slug !== existingPost.rows[0].slug) {
    const slugCheck = await query('SELECT id FROM blog_posts WHERE slug = $1 AND id != $2', [slug, id]);
    if (slugCheck.rows.length > 0) {
      throw new AppError('Ce slug existe déjà', 400);
    }
  }
  
  // Build update query dynamically
  const updates = [];
  const params = [];
  let paramCount = 1;
  
  if (title !== undefined) {
    updates.push(`title = $${paramCount}`);
    params.push(title);
    paramCount++;
  }
  if (slug !== undefined) {
    updates.push(`slug = $${paramCount}`);
    params.push(slug);
    paramCount++;
  }
  if (excerpt !== undefined) {
    updates.push(`excerpt = $${paramCount}`);
    params.push(excerpt);
    paramCount++;
  }
  if (content !== undefined) {
    updates.push(`content = $${paramCount}`);
    params.push(content);
    paramCount++;
  }
  if (featured_image !== undefined) {
    updates.push(`featured_image = $${paramCount}`);
    params.push(featured_image);
    paramCount++;
  }
  if (category_id !== undefined) {
    updates.push(`category_id = $${paramCount}`);
    params.push(category_id);
    paramCount++;
  }
  if (status !== undefined) {
    updates.push(`status = $${paramCount}`);
    params.push(status);
    paramCount++;
    
    // Set published_at if changing to published
    if (status === 'published' && existingPost.rows[0].status !== 'published') {
      updates.push(`published_at = $${paramCount}`);
      params.push(new Date());
      paramCount++;
    }
  }
  if (is_featured !== undefined) {
    updates.push(`is_featured = $${paramCount}`);
    params.push(is_featured);
    paramCount++;
  }
  
  if (updates.length === 0) {
    throw new AppError('Aucune donnée à mettre à jour', 400);
  }
  
  params.push(id);
  const result = await query(
    `UPDATE blog_posts SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    params
  );
  
  // Update tags if provided
  if (tags !== undefined && Array.isArray(tags)) {
    // Remove existing tags
    await query('DELETE FROM blog_post_tags WHERE post_id = $1', [id]);
    
    // Add new tags
    for (const tagId of tags) {
      await query(
        'INSERT INTO blog_post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [id, tagId]
      );
    }
  }
  
  logger.info(`Blog post updated: ${id} by user ${req.user.id}`);
  
  res.json({ success: true, data: result.rows[0] });
};

/**
 * Delete blog post
 */
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  
  const result = await query('DELETE FROM blog_posts WHERE id = $1 RETURNING id', [id]);
  
  if (result.rows.length === 0) {
    throw new AppError('Article non trouvé', 404);
  }
  
  logger.info(`Blog post deleted: ${id} by user ${req.user.id}`);
  
  res.json({ success: true, message: 'Article supprimé avec succès' });
};

/**
 * Get all categories
 */
exports.getAllCategories = async (req, res) => {
  const result = await query(`
    SELECT bc.*, COUNT(bp.id) as post_count
    FROM blog_categories bc
    LEFT JOIN blog_posts bp ON bc.id = bp.category_id AND bp.status = 'published'
    GROUP BY bc.id
    ORDER BY bc.name
  `);
  
  res.json({ success: true, data: result.rows });
};

/**
 * Create category
 */
exports.createCategory = async (req, res) => {
  const { name, slug, description } = req.body;
  
  const result = await query(
    'INSERT INTO blog_categories (name, slug, description) VALUES ($1, $2, $3) RETURNING *',
    [name, slug, description]
  );
  
  res.status(201).json({ success: true, data: result.rows[0] });
};

/**
 * Get all tags
 */
exports.getAllTags = async (req, res) => {
  const result = await query(`
    SELECT bt.*, COUNT(bpt.post_id) as post_count
    FROM blog_tags bt
    LEFT JOIN blog_post_tags bpt ON bt.id = bpt.tag_id
    GROUP BY bt.id
    ORDER BY bt.name
  `);
  
  res.json({ success: true, data: result.rows });
};

/**
 * Create tag
 */
exports.createTag = async (req, res) => {
  const { name, slug } = req.body;
  
  const result = await query(
    'INSERT INTO blog_tags (name, slug) VALUES ($1, $2) RETURNING *',
    [name, slug]
  );
  
  res.status(201).json({ success: true, data: result.rows[0] });
};