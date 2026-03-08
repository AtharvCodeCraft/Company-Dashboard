const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  status: { type: String, enum: ['Active', 'Completed', 'On Hold'], default: 'Active' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
