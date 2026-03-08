const express = require('express');
const router = express.Router();
const { createProduct, getProducts } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getProducts)
  .post(protect, authorize('Super Admin', 'Admin'), createProduct);

module.exports = router;
