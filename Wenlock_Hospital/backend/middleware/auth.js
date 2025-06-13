const jwt = require('jsonwebtoken');

exports.verifyAdmin = (req, res, next) => {
const authHeader = req.headers.authorization;
if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ msg: 'Missing token' });

const token = authHeader.split(' ')[1];
try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
if (decoded.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
req.admin = decoded;
next();
} catch (err) {
return res.status(401).json({ msg: 'Invalid token' });
}
};