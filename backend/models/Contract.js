const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  description: { type: String },
  value: { type: Number, required: true },
  startDate: { type: Date, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Completed', 'Cancelled'], default: 'Active' },
  assignedTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  fileUrl: { type: String } // To store uploaded PDF/Doc links
}, { timestamps: true });

module.exports = mongoose.model('Contract', contractSchema);
