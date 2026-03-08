const express = require('express');
const router = express.Router();
const { createTicket, getTickets, updateTicket } = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTickets)
  .post(protect, createTicket);

router.route('/:id')
  .put(protect, authorize('Super Admin', 'Admin', 'Manager'), updateTicket);

module.exports = router;
