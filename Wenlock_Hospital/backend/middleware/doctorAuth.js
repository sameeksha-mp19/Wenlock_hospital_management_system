const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");

const doctorProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.doctor = await Doctor.findById(decoded.id).select("-password");
      if (!req.doctor) {
        return res.status(401).json({ message: "Not authorized, doctor not found" });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

module.exports = doctorProtect;
