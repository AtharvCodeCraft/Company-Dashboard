const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true, default: Date.now },
  checkIn: { type: Date },
  checkOut: { type: Date },
  workingHours: { type: Number, default: 0 },
  status: { type: String, enum: ['Present', 'Absent', 'Half Day', 'Late'], default: 'Present' }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
