const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  dateOfJoining: { type: Date, default: Date.now },
  salary: { type: Number },
  productivityScore: { type: Number, default: 0 },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
