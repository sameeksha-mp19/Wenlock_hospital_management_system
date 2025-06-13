// In your emergencyController.js (or similar)
const Emergency = require('../models/Emergency');

exports.createEmergency = async (req, res) => {
  try {
    const { type, department, patientId, message } = req.body;

    const emergency = new Emergency({
      type,
      department,
      patient: patientId,
      message,
    });

    await emergency.save();

    res.status(201).json({ message: 'Emergency created', emergency });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
