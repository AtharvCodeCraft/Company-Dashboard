const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/check-in', protect, checkIn);
router.post('/check-out', protect, checkOut);
router.get('/', protect, getAttendance);

module.exports = router;
