const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('Super Admin', 'Admin', 'Manager'), getDashboardStats);

module.exports = router;
