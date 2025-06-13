// controllers/otController.js
const OperatingTheatre = require("../models/OperatingTheatre");   // OT master
const OTSchedule       = require("../models/OTSchedule");
const { isClashing }   = require("../utils/slotHelper");          // (still useful)
const isValidId = require('../utils/isValidObjectId');
/**
 * POST  /api/ot/book
 * Body  { otId?, department?, startTime, endTime,
 *         patientId, doctorId, surgery,
 *         isEmergency, mustHaveEquip?: [String] }
 */
exports.bookOT = async (req, res) => {
  try {
    const {
      otId,
      department,
      startTime,
      endTime,
      patientId,
      doctorId,
      surgery,
      isEmergency = false,
      mustHaveEquip = [],
    } = req.body;

    if (!startTime || !endTime)
      return res.status(400).json({ msg: "Missing time range" });

    /* 1️⃣  build OT query (no isActive flag) ------------------------------ */
    const otQuery = otId ? { _id: otId } : { department };

    if (mustHaveEquip.length) otQuery.equipment = { $all: mustHaveEquip };

    const candidateOTs = await OperatingTheatre.find(otQuery).sort("otNumber");
    if (!candidateOTs.length)
      return res.status(404).json({ msg: "No OT matches criteria" });

    /* 2️⃣  choose first non-clashing OT ---------------------------------- */
    let selectedOT = null;
    for (const ot of candidateOTs) {
      const clash = await OTSchedule.exists({
        ot: ot._id,
        status: { $in: ["scheduled", "in-progress"] },
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
      });
      if (!clash) {
        selectedOT = ot;
        break;
      }
    }

    /* 3️⃣  if none free & not emergency ➜ fail --------------------------- */
    if (!selectedOT && !isEmergency)
      return res
        .status(409)
        .json({ msg: "All matching OTs busy for that slot" });

    /* 4️⃣  emergency override (take first OT even if clashing) ----------- */
    if (!selectedOT && isEmergency) selectedOT = candidateOTs[0];

    /* 5️⃣  save schedule -------------------------------------------------- */
    const newSched = await OTSchedule.create({
      ot: selectedOT._id,
      doctor: doctorId,
      patient: patientId,
      surgery,
      startTime,
      endTime,
      isEmergency,
    });

    // if (global.io) global.io.emit("ot:new", newSched);
    res.status(201).json({ msg: "OT booked", schedule: newSched });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* ---------------------------------------------------------------------- */
/** GET /api/ot/dashboard?date=YYYY-MM-DD */
exports.getDashboard = async (req, res) => {
  try {
    const date     = req.query.date ? new Date(req.query.date) : new Date();
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd   = new Date(date.setHours(23, 59, 59, 999));

    /* pending  = future scheduled -------------------------------------- */
    const pending = await OTSchedule.find({
      status: "scheduled",
      startTime: { $gt: new Date() },
    })
      .populate("ot patient doctor")
      .sort("startTime");

    /* bookedToday = any status (not cancelled) overlapping today -------- */
    const bookedToday = await OTSchedule.find({
      startTime: { $lt: dayEnd },
      endTime: { $gt: dayStart },
      status: { $nin: ["cancelled"] },
    })
      .populate("ot patient doctor")
      .sort({ isEmergency: -1, startTime: 1 });

   /* available   = OTs not booked today --------------------------------- */
const allOTs  = await OperatingTheatre.find({});
const busyIds = bookedToday.map(b => b.ot._id.toString());
const available = allOTs.filter(ot => !busyIds.includes(ot._id.toString()));


    res.json({ pending, bookedToday, available });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Server error" });
  }
};

/* ---------------------------------------------------------------------- */
/** PUT /api/ot/schedule/:id/status   body:{ status } */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id))
      return res.status(400).json({ msg: 'Invalid schedule id' });

    const sched = await OTSchedule.findById(id);
    if (!sched) return res.status(404).json({ msg: 'Schedule not found' });

    sched.status = req.body.status;
    await sched.save();

    // if (global.io) global.io.emit('ot:update', sched);
    res.json({ msg: 'Updated', schedule: sched });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

/* ------------------------------------------------------------------ */
/** GET /api/ot/schedules?otId=&date=YYYY-MM-DD */
exports.listSchedules = async (req, res) => {
  try {
    const { otId, date } = req.query;
    const filter = {};

    if (otId) {
      if (!isValidId(otId))
        return res.status(400).json({ msg: 'Invalid OT id' });
      filter.ot = otId;
    }

    if (date) {
      const s = new Date(date);
      const e = new Date(date);
      s.setHours(0, 0, 0, 0);
      e.setHours(23, 59, 59, 999);
      filter.startTime = { $lt: e };
      filter.endTime = { $gt: s };
    }

    const list = await OTSchedule.find(filter)
      .populate('ot doctor patient')
      .sort('startTime');

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};