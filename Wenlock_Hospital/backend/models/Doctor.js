// const mongoose = require('mongoose');

// const doctorSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String, // hashed
//   department: String,
//   role: { type: String, default: 'doctor' },
// });

// module.exports = mongoose.model('Doctor', doctorSchema);
// models/Doctor.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  department: { type: String, required: true }, // e.g., Cardiology
});

// Password match method
doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Before saving doctor, hash password if modified
doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Doctor', doctorSchema);
