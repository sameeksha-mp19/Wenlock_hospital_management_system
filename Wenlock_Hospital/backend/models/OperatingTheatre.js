const mongoose = require("mongoose");

const operatingTheatreSchema = new mongoose.Schema(
  {
    otNumber:   { type: Number, required: true, unique: true },
    name:       { type: String, required: true },          // “OT-1 Main”
    department: { type: String, required: true },
    equipment:  [{ type: String }],
    notes:      { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OperatingTheatre", operatingTheatreSchema);