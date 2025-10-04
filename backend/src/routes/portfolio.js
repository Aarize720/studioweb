const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectImage,
  deleteProjectImage,
  getCategories,
} = require('../controllers/portfolioController');

// Routes publiques
router.get('/categories', getCategories);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// Routes protégées (admin uniquement)
router.post('/', protect, authorize('admin', 'super_admin'), createProject);
router.put('/:id', protect, authorize('admin', 'super_admin'), updateProject);
router.delete('/:id', protect, authorize('admin', 'super_admin'), deleteProject);

// Gestion des images
router.post('/:id/images', protect, authorize('admin', 'super_admin'), addProjectImage);
router.delete('/:id/images/:imageId', protect, authorize('admin', 'super_admin'), deleteProjectImage);

module.exports = router;