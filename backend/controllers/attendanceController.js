const Attendance = require('../models/Attendance');

exports.checkIn = async (req, res) => {
  try {
    const today = new Date().setHours(0,0,0,0);
    let attendance = await Attendance.findOne({
      employee: req.body.employeeId,
      date: { $gte: today }
    });

    if (attendance) return res.status(400).json({ message: 'Already checked in today' });

    attendance = await Attendance.create({ employee: req.body.employeeId, checkIn: new Date() });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const today = new Date().setHours(0,0,0,0);
    const attendance = await Attendance.findOne({
      employee: req.body.employeeId,
      date: { $gte: today }
    });

    if (!attendance) return res.status(404).json({ message: 'No check-in found for today' });
    if (attendance.checkOut) return res.status(400).json({ message: 'Already checked out' });

    attendance.checkOut = new Date();
    attendance.workingHours = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60); // Hrs
    await attendance.save();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().populate('employee');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
