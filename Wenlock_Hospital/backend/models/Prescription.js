// const mongoose = require('mongoose');

// const prescriptionSchema = new mongoose.Schema({
//   doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
//   patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
//   token: { type: mongoose.Schema.Types.ObjectId, ref: 'Token' },
//   medicines: [
//     {
//       name: String,
//       dosage: String,
//       instructions: String,
//     },
//   ],
//   notes: String,
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Prescription', prescriptionSchema);
const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  token: { type: mongoose.Schema.Types.ObjectId, ref: 'Token' },
  medicines: [
    {
      name: String,
      dosage: String,
      instructions: String,
      quantityPerDay: { type: Number, default: 1 },  // number of tablets/pills per day
      days: { type: Number, default: 1 },             // total number of days to take
    },
  ],
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
