const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
name: { type: String, required: true },
stock: { type: Number, required: true },
price: { type: Number, required: true },
description: { type: String },
expiryDate: { type: Date },
});

module.exports = mongoose.model('Medicine', medicineSchema);