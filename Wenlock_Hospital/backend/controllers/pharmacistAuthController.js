const Pharmacist = require("../models/Pharmacist");
const jwt = require("jsonwebtoken");

exports.loginPharmacist = async (req, res) => {
  const { email, password } = req.body;

  try {
    const pharmacist = await Pharmacist.findOne({ email });
    if (!pharmacist) {
      return res.status(404).json({ message: "Pharmacist not found" });
    }

    const isMatch = await pharmacist.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { pharmacistId: pharmacist._id, role: "pharmacist" },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      pharmacist: { id: pharmacist._id, email: pharmacist.email }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
