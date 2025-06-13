// backend/models/otModel.js
const mongoose = require('mongoose');

const otSchema = new mongoose.Schema({
otName: {
type: String,
required: true,
},
capacity: Number,
location: String,
// add other fields if needed
});

const OperatingTheatre = mongoose.model('OT', otSchema);

module.exports = OperatingTheatre;