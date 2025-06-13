const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// POST /api/admin/login
router.post('/login', async (req, res) => {
try {
const { username, password } = req.body;
const admin = await Admin.findOne({ username });
if (!admin) return res.status(401).json({ msg: 'Invalid credentials' });


const isMatch = await admin.matchPassword(password);
if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
  expiresIn: '1d',
});

res.json({ token, msg: 'Login successful' });
} catch (err) {
console.error(err);
res.status(500).json({ msg: 'Server error' });
}
});

module.exports = router;