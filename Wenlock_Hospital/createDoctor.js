const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./backend/models/Doctor');

dotenv.config(); // loads .env from root

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('MongoDB connected');

  const doctor = new Doctor({
    name: 'Dr.John',
    email: 'drsjohn@hospital.com',
    password: 'test1234', // will get hashed automatically
    department: 'Cardiology'
  });

  await doctor.save();
  console.log('Doctor created');
  mongoose.disconnect();
}).catch(err => {
  console.error(err);
});
