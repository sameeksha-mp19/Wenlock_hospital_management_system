// backend/models/OT.js
const mongoose = require('mongoose');

/**
 *  Operating-Theatre master schema
 *  (no isActive flag; availability is derived from schedules)
 */
const otSchema = new mongoose.Schema(
  {
    otNumber:   { type: Number, required: true, unique: true }, // 1,2,3…
    name:       { type: String, required: true },               // "OT-1 Main"
    department: { type: String, required: true },               // Cardiology …
    location:   { type: String },
    equipment:  [{ type: String }],
    notes:      { type: String }
  },
  { timestamps: true }
);

/* IMPORTANT: register with name "OT" */
module.exports = mongoose.model('OT', otSchema);