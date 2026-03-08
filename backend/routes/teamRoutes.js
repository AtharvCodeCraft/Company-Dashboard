const express = require('express');
const router = express.Router();
const { createTeam, getTeams, updateTeam } = require('../controllers/teamController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTeams)
  .post(protect, authorize('Super Admin', 'Admin'), createTeam);

router.route('/:id')
  .put(protect, authorize('Super Admin', 'Admin'), updateTeam);

module.exports = router;
