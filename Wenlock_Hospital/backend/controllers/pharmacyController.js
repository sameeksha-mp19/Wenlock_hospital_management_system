// const Medicine = require('../models/Medicine');

// exports.getMedicines = async (req, res) => {
// const meds = await Medicine.find();
// res.json(meds);
// };

// exports.addMedicine = async (req, res) => {
// const med = new Medicine(req.body);
// await med.save();
// res.status(201).json(med);
// };

// exports.updateMedicine = async (req, res) => {
// const med = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
// res.json(med);
// };

// exports.deleteMedicine = async (req, res) => {
// await Medicine.findByIdAndDelete(req.params.id);
// res.json({ message: 'Medicine deleted' });
// };
// const Medicine = require("../models/Medicine");

// // Find alternative medicines by name prefix
// const findAlternatives = async (name) => {
//   const regex = new RegExp(`^${name.split(" ")[0]}`, "i");
//   return await Medicine.find({ name: { $regex: regex }, stock: { $gt: 0 } });
// };

// exports.handlePrescription = async (req, res) => {
//   try {
//     const { prescriptionId, medicines } = req.body;

//     if (!medicines || medicines.length === 0) {
//       return res.status(400).json({ message: "No medicines provided" });
//     }

//     const results = [];
//     for (let item of medicines) {
//       const found = await Medicine.findOne({ name: item.name });

//       if (found && found.stock > 0) {
//         // Medicine is available
//         found.stock -= 1;
//         await found.save();
//         results.push({ name: item.name, status: "available" });
//       } else {
//         // Not available — find alternatives
//         const alternatives = await findAlternatives(item.name);
//         results.push({
//           name: item.name,
//           status: "not available",
//           alternatives: alternatives.map((alt) => alt.name),
//         });
//       }
//     }

//     return res.json({
//       message: "Prescription checked",
//       results,
//     });
//   } catch (err) {
//     console.error("Error checking prescription:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
const Medicine = require("../models/Medicine");

const findAlternatives = async (name) => {
  const regex = new RegExp(`^${name.split(" ")[0]}`, "i");
  return await Medicine.find({ name: { $regex: regex }, stock: { $gt: 0 } });
};
exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addMedicine = async (req, res) => {
  try {
    const { name, stock, price, description, expiryDate } = req.body;
    const newMed = new Medicine({ name, stock, price, description, expiryDate });
    await newMed.save();
    res.status(201).json({ message: "Medicine added", medicine: newMed });
  } catch (error) {
    console.error("Error adding medicine:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const updated = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Medicine not found" });
    res.json({ message: "Medicine updated", medicine: updated });
  } catch (error) {
    console.error("Error updating medicine:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    const deleted = await Medicine.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Medicine not found" });
    res.json({ message: "Medicine deleted" });
  } catch (error) {
    console.error("Error deleting medicine:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.handlePrescription = async (req, res) => {
  try {
    const { medicines } = req.body;

    if (!medicines || medicines.length === 0) {
      return res.status(400).json({ message: "No medicines provided" });
    }

    const results = [];
    const lowStockAlerts = [];

    for (let item of medicines) {
      const found = await Medicine.findOne({ name: item.name });

      if (found && found.stock > 0) {
        // Calculate total quantity to deduct
        const quantityPerDay = item.quantityPerDay || 1; // default 1 if not provided
        const days = item.days || 1; // default 1 if not provided
        const totalNeeded = quantityPerDay * days;

        if (found.stock >= totalNeeded) {
          found.stock -= totalNeeded;
          await found.save();

          // Low stock alert if less than 50
          if (found.stock < 50) {
            lowStockAlerts.push({
              name: found.name,
              remainingStock: found.stock,
              alert: "Low stock! Please restock soon."
            });
          }

          results.push({ name: item.name, status: "available", deducted: totalNeeded });
        } else {
          // Not enough stock
          results.push({ name: item.name, status: "not enough stock", availableStock: found.stock });
          // You can also find alternatives here if you want
        }
      } else {
        // Medicine not found or zero stock
        results.push({ name: item.name, status: "not available" });
        // You can also find alternatives here if you want
      }
    }

    return res.json({
      message: "Prescription checked",
      results,
      lowStockAlerts
    });

  } catch (err) {
    console.error("Error checking prescription:", err);
    res.status(500).json({ message: "Server error" });
  }
};
