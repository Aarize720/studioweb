const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { validate, productSchema } = require('../middleware/validation');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('admin', 'super_admin'), validate(productSchema), createProduct);
router.put('/:id', protect, authorize('admin', 'super_admin'), updateProduct);
router.delete('/:id', protect, authorize('admin', 'super_admin'), deleteProduct);

module.exports = router;