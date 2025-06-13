// const express = require('express');
// const router = express.Router();
// const pharmacyController = require('../controllers/pharmacyController');
// router.post("/checkPrescription", pharmacyController.handlePrescription);
// router.get('/medicines', pharmacyController.getMedicines);
// router.post('/medicines', pharmacyController.addMedicine);
// router.put('/medicines/:id', pharmacyController.updateMedicine);
// router.delete('/medicines/:id', pharmacyController.deleteMedicine);

// module.exports = router;
const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');
const authenticatePharmacist = require('../middleware/authPharmacist');

router.post("/checkPrescription", authenticatePharmacist, pharmacyController.handlePrescription);
router.get('/medicines', authenticatePharmacist, pharmacyController.getMedicines);
router.post('/medicines', authenticatePharmacist, pharmacyController.addMedicine);
router.put('/medicines/:id', authenticatePharmacist, pharmacyController.updateMedicine);
router.delete('/medicines/:id', authenticatePharmacist, pharmacyController.deleteMedicine);

module.exports = router;