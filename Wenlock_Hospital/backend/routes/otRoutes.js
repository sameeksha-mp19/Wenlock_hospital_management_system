const express = require('express');
const router  = express.Router();
const otc     = require('../controllers/otController');
const doctorAuth = require('../middleware/doctorAuth');  // or custom OT staff auth

// Most actions need authenticated staff
router.use(doctorAuth);

router.post('/book', otc.bookOT);
router.get('/dashboard', otc.getDashboard);
router.put('/schedule/:id/status', otc.updateStatus);
router.get('/schedules', otc.listSchedules);

module.exports = router;