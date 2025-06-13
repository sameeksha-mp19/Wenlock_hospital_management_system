const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
department: { type: String, required: true },
tokenNumber: { type: Number, required: true },
status: { type: String, enum: ["waiting", "being seen","done"], default: "waiting" },
createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Token", tokenSchema);