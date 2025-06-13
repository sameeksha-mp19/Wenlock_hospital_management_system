const mongoose = require('mongoose');
const Admin = require('./backend/models/Admin');
require('dotenv').config();

async function seedAdmin() {
await mongoose.connect(process.env.MONGO_URI);

const exists = await Admin.findOne({ username: 'admin' });
if (exists) {
console.log('Admin already exists');
} else {
const admin = await Admin.create({
username: 'admin',
password: 'admin123', // will be hashed
});
console.log('Admin created:', admin.username);
}

mongoose.disconnect();
}
seedAdmin();