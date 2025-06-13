const Token = require('../models/Token');
const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const Emergency = require('../models/Emergency');
const Doctor = require('../models/Doctor');

// View token queue with patient details (filtered by doctor's department)
exports.getTokenQueue = async (req, res) => {
  try {
    const doctor = req.doctor; // assume doctor is set by auth middleware

    const tokens = await Token.find({ department: doctor.department, status: { $in: ['waiting', 'being seen'] } })
      .populate('patient', 'name age severity email')
      .sort('tokenNumber');

    res.json({ tokens });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Mark patient status: "being seen" or "done"
exports.updatePatientStatus = async (req, res) => {
  try {
    const { tokenId, status } = req.body;
    if (!['waiting', 'being seen', 'done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const token = await Token.findById(tokenId);
    if (!token) return res.status(404).json({ message: 'Token not found' });

    token.status = status;
    await token.save();

    res.json({ message: 'Status updated', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add digital prescription for a patient/token
exports.addPrescription = async (req, res) => {
  try {
    const doctor = req.doctor;
    const { tokenId, medicines, notes } = req.body;

    const token = await Token.findById(tokenId).populate('patient');
    if (!token) return res.status(404).json({ message: 'Token not found' });

    const prescription = new Prescription({
      doctor: doctor._id,
      patient: token.patient._id,
      token: token._id,
      medicines,
      notes,
    });

    await prescription.save();
    res.json({ message: 'Prescription added', prescription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// View upcoming appointments for the doctor
exports.getAppointments = async (req, res) => {
  try {
    const doctor = req.doctor;

    const appointments = await Appointment.find({ doctor: doctor._id, status: 'scheduled' })
      .populate('patient', 'name age email')
      .sort('date');

    res.json({ appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update appointment status (e.g., mark completed or cancelled)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = status;
    await appointment.save();

    res.json({ message: 'Appointment updated', appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get new emergency alerts for the doctor's department
exports.getEmergencyAlerts = async (req, res) => {
  try {
    const doctor = req.doctor;

    const emergencies = await Emergency.find({ department: doctor.department, status: 'new' })
      .populate('patient', 'name age severity')
      .sort({ receivedAt: -1 });

    res.json({ emergencies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Acknowledge or resolve emergency alert
exports.updateEmergencyStatus = async (req, res) => {
  try {
    const { emergencyId, status } = req.body;
    if (!['new', 'acknowledged', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const emergency = await Emergency.findById(emergencyId);
    if (!emergency) return res.status(404).json({ message: 'Emergency not found' });

    emergency.status = status;
    await emergency.save();

    res.json({ message: 'Emergency status updated', emergency });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Coordinate with OT or Pharmacy (simplified as updating token or prescription status)
exports.coordinateWithDepartment = async (req, res) => {
  try {
    const { tokenId, department, action } = req.body;
    // department can be 'OT' or 'Pharmacy', action could be 'request', 'cancel' etc.

    // Example: just save an update or emit a notification (expand later)
    // Here, just returning success for demonstration

    res.json({ message: `Request sent to ${department} for token ${tokenId} with action ${action}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
