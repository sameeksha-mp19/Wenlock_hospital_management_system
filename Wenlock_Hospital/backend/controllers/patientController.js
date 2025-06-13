const Patient = require("../models/Patient");
const Token = require("../models/Token");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

exports.registerPatient = async (req, res) => {
const { name, email, password } = req.body;
const existing = await Patient.findOne({ email });
if (existing) return res.status(400).json({ message: "Email already registered" });

const patient = await Patient.create({ name, email, password });

res.status(201).json({
_id: patient._id,
name: patient.name,
email: patient.email,
token: generateToken(patient._id)
});
};

exports.loginPatient = async (req, res) => {
const { email, password } = req.body;
const patient = await Patient.findOne({ email });
if (!patient || !(await patient.matchPassword(password)))
return res.status(401).json({ message: "Invalid credentials" });

res.json({
_id: patient._id,
name: patient.name,
email: patient.email,
token: generateToken(patient._id)
});
};

exports.submitDetails = async (req, res) => {
const { age, department, severity } = req.body;
const patient = await Patient.findById(req.user._id);
if (!patient) return res.status(404).json({ message: "Patient not found" });

patient.age = age;
patient.department = department;
patient.severity = severity;
await patient.save();

// generate next token number for department
const lastToken = await Token.find({ department }).sort({ tokenNumber: -1 }).limit(1);
const nextTokenNumber = lastToken.length ? lastToken[0].tokenNumber + 1 : 1;

const tokenEntry = await Token.create({
patient: patient._id,
department,
tokenNumber: nextTokenNumber
});

res.json({
message: "Details submitted and token generated",
tokenNumber: tokenEntry.tokenNumber,
department
});
};

exports.getTokenStatus = async (req, res) => {
const patientToken = await Token.findOne({ patient: req.user._id });
if (!patientToken) return res.status(404).json({ message: "No token found" });

const { department, tokenNumber } = patientToken;

const allTokens = await Token.find({ department, status: "waiting" }).sort({ tokenNumber: 1 });

const currentServing = allTokens.length ? allTokens[0].tokenNumber : null;

const positionInQueue = allTokens.findIndex(
(entry) => entry.tokenNumber === tokenNumber
);

res.json({
yourToken: tokenNumber,
currentServing,
positionInQueue: positionInQueue === -1 ? "Served" : positionInQueue
});
};