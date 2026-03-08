const express = require('express');
const router = express.Router();
const { createContract, getContracts, updateContract } = require('../controllers/contractController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('Super Admin', 'Admin', 'Manager'), getContracts)
  .post(protect, authorize('Super Admin', 'Admin'), createContract);

router.route('/:id')
  .put(protect, authorize('Super Admin', 'Admin'), updateContract);

module.exports = router;
