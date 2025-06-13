// backend/models/OTSchedule.js
const mongoose = require('mongoose');

const otScheduleSchema = new mongoose.Schema(
  {
    ot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OT',            // ← must match the model name above
      required: true
    },
    doctor:   { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor',  required: true },
    patient:  { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },

    surgery:      { type: String, required: true },
    startTime:    { type: Date,   required: true },
    endTime:      { type: Date,   required: true },
    isEmergency:  { type: Boolean, default: false },

    // models/OTSchedule.js
status: {
  type: String,
  enum: [
    'scheduled', 'Scheduled',
    'in-progress', 'In-progress',
    'completed',  'Completed',
    'cancelled',  'Cancelled'
  ],
  default: 'scheduled'
}

  },
  { timestamps: true }
);

module.exports = mongoose.model('OTSchedule', otScheduleSchema);