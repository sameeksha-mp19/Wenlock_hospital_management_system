const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const pharmacistSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

pharmacistSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Pharmacist", pharmacistSchema);
