// const jwt = require("jsonwebtoken");
// const Pharmacist = require("../models/Pharmacist");

// const authenticatePharmacist = async (req, res, next) => {
// try {
// const token = req.headers.authorization?.split(" ")[1];
// if (!token) return res.status(401).json({ message: "Unauthorized: No token" });
// const decoded = jwt.verify(token, process.env.JWT_SECRET);
// const pharmacist = await Pharmacist.findById(decoded.id);

// if (!pharmacist) {
//   return res.status(401).json({ message: "Unauthorized: Invalid pharmacist" });
// }

// req.pharmacist = pharmacist;
// next();
// } catch (err) {
// console.error("Pharmacist auth error:", err);
// res.status(401).json({ message: "Unauthorized" });
// }
// };
// module.exports = authenticatePharmacist;

const jwt = require("jsonwebtoken");
const Pharmacist = require("../models/Pharmacist");

const authenticatePharmacist = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const pharmacist = await Pharmacist.findById(decoded.pharmacistId);

    if (!pharmacist) {
      return res.status(401).json({ message: "Unauthorized: Invalid pharmacist" });
    }

    req.pharmacist = pharmacist;
    next();
  } catch (err) {
    console.error("Pharmacist auth error:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authenticatePharmacist;
