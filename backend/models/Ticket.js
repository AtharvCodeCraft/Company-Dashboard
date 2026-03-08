const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
