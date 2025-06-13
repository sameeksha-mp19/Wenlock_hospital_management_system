const express = require("express");
const {
registerPatient,
loginPatient,
submitDetails,
getTokenStatus
} = require("../controllers/patientController");

const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.post("/details", protect, submitDetails);
router.get("/status", protect, getTokenStatus);

module.exports = router;