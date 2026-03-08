const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectById, updateProject } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getProjects)
  .post(protect, authorize('Super Admin', 'Admin', 'Manager'), createProject);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, authorize('Super Admin', 'Admin', 'Manager'), updateProject);

module.exports = router;
