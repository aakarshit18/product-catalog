const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Admin-only routes
router.post('/',
  verifyToken,
  isAdmin,
  upload.single('image'),
  productController.createProduct
);
router.put('/:id',
  verifyToken,
  isAdmin,
  upload.single('image'),
  productController.updateProduct
);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

// Public routes
// Get Product
router.get('/', verifyToken, productController.getProducts);

// Reviews
router.post('/:id/review', verifyToken, productController.addReview);
router.get('/:id', verifyToken, productController.getProductWithReviews);

module.exports = router;
