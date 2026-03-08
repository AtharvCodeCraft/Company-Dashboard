const express = require('express');
const router = express.Router();
const { registerSuperAdmin, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/init', registerSuperAdmin); // Initial setup endpoint
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
