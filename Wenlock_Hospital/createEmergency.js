require('dotenv').config();
const mongoose = require('mongoose');
const Emergency = require('./backend/models/Emergency');

async function createEmergency() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const emergency = new Emergency({
      type: 'Accident',
      department: 'Orthopedics',
      patient: '683d8dfd96ec1ab7325543ee',
      message: 'Patient has a broken leg after a fall.',
    });

    await emergency.save();
    console.log('Emergency created:', emergency);

    mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

createEmergency();
