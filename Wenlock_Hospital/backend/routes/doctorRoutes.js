// const express = require('express');
// const router = express.Router();
// const doctorController = require('../controllers/doctorController');
// const authMiddleware = require('../middleware/authMiddleware'); // Assume you have auth to set req.doctor
// const doctorAuth = require('../middleware/doctorAuth');
// router.use(doctorAuth);  // protect all doctor routes

// // Protect all routes: doctor must be authenticated
// router.use(authMiddleware.doctorAuth);

// // Get token queue with patient details
// router.get('/tokens', doctorController.getTokenQueue);

// // Update patient token status
// router.put('/token/status', doctorController.updatePatientStatus);

// // Add prescription
// router.post('/prescription', doctorController.addPrescription);

// // Get upcoming appointments
// router.get('/appointments', doctorController.getAppointments);

// // Update appointment status
// router.put('/appointment/status', doctorController.updateAppointmentStatus);

// // Get emergency alerts
// router.get('/emergencies', doctorController.getEmergencyAlerts);

// // Update emergency status
// router.put('/emergency/status', doctorController.updateEmergencyStatus);

// // Coordinate with OT or Pharmacy
// router.post('/coordinate', doctorController.coordinateWithDepartment);

// module.exports = router;
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const doctorAuth = require('../middleware/doctorAuth');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');

// Public route: doctor login (no auth middleware here)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ email });

    if (doctor && (await doctor.matchPassword(password))) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      res.json({
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        department: doctor.department,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply doctorAuth middleware for all routes below
router.use(doctorAuth);

// Protected doctor routes
router.get('/tokens', doctorController.getTokenQueue);
router.put('/token/status', doctorController.updatePatientStatus);
router.post('/prescription', doctorController.addPrescription);
router.get('/appointments', doctorController.getAppointments);
router.put('/appointment/status', doctorController.updateAppointmentStatus);
router.get('/emergencies', doctorController.getEmergencyAlerts);
router.put('/emergency/status', doctorController.updateEmergencyStatus);
router.post('/coordinate', doctorController.coordinateWithDepartment);

module.exports = router;
