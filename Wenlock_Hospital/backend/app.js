const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const doctorRoutes = require('./routes/doctorRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');  // <-- Import here
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const pharmacistAuthRoutes = require("./routes/pharmacistAuthroutes");
const otRoutes = require('./routes/otRoutes');
const adminRoutes = require('./routes/adminRoutes');
require('./models');
dotenv.config();

const connectDB = require("./config/db");
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/ot', otRoutes);
app.use("/api/ot-master", require("./routes/otMasterRoutes"));


app.use('/api/admin', adminRoutes);
app.use("/api/pharmacist", pharmacistAuthRoutes);

app.use("/api/patient", require("./routes/patientRoutes"));
app.use('/api/doctor', doctorRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api', emergencyRoutes); 
app.get("/", (req, res) => res.send("Wenlock Hospital API running"));

module.exports = app;