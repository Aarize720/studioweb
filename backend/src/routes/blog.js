const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateBlogPost } = require('../middleware/validation');

// Public routes
router.get('/', optionalAuth, asyncHandler(blogController.getAllPosts));
router.get('/categories', asyncHandler(blogController.getAllCategories));
router.get('/tags', asyncHandler(blogController.getAllTags));
router.get('/:slug', optionalAuth, asyncHandler(blogController.getPostBySlug));

// Protected routes (admin only)
router.post('/', protect, authorize('admin', 'super_admin'), validateBlogPost, asyncHandler(blogController.createPost));
router.put('/:id', protect, authorize('admin', 'super_admin'), asyncHandler(blogController.updatePost));
router.delete('/:id', protect, authorize('admin', 'super_admin'), asyncHandler(blogController.deletePost));

router.post('/categories', protect, authorize('admin', 'super_admin'), asyncHandler(blogController.createCategory));
router.post('/tags', protect, authorize('admin', 'super_admin'), asyncHandler(blogController.createTag));

module.exports = router;