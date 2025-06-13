const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Pharmacist = require('./backend/models/Pharmacist');

dotenv.config(); // loads variables from .env

mongoose.connect(process.env.MONGO_URI, {
useNewUrlParser: true,
useUnifiedTopology: true
}).then(async () => {
console.log('MongoDB connected');

const hashedPassword = await bcrypt.hash('secret123', 10); // hash manually

const pharmacist = new Pharmacist({
email: 'pharma1@hospital.com',
password: hashedPassword
});

await pharmacist.save();
console.log('Pharmacist created');
mongoose.disconnect();
}).catch(err => {
console.error(err);
});