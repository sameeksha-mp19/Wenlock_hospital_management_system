const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  type: String, // e.g., 'Accident', 'Heart attack'
  department: String,
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  message: String,
  receivedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['new', 'acknowledged', 'resolved'], default: 'new' },
});

module.exports = mongoose.model('Emergency', emergencySchema);
