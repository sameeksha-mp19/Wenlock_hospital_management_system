/**
 *  OT-Master controller
 *  — keeps metadata of every Operating Theatre (OT)
 *  — no “isActive”; availability is derived from schedules
 */

const OperatingTheatre = require("../models/OperatingTheatre");
const OTSchedule       = require("../models/OTSchedule");

/* ─────────────────────────────────────────────────────────────── */
/*  POST /api/ot-master   |  body = { otNumber, name, department, … } */
exports.createOT = async (req, res) => {
  try {
    const ot = await OperatingTheatre.create(req.body);
    return res.status(201).json({ msg: "OT created", ot });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: err.message });
  }
};

/* ─────────────────────────────────────────────────────────────── */
/**
 *  GET /api/ot-master
 *  Query params:
 *     status=[booked|available]   → optional filter
 *     date=YYYY-MM-DD            → defaults today
 *     start=HH:MM & end=HH:MM    → optional window (24-h)
 *
 *  Returns full OT list with synthetic status OR the filtered list.
 */
exports.listOTs = async (req, res) => {
  try {
    const { status, date, start, end } = req.query;

    /* time window build */
    const baseDay = date ? new Date(date) : new Date();
    const windowStart = start
      ? new Date(`${baseDay.toISOString().split("T")[0]}T${start}:00Z`)
      : new Date(baseDay.setHours(0, 0, 0, 0));
    const windowEnd = end
      ? new Date(`${baseDay.toISOString().split("T")[0]}T${end}:00Z`)
      : new Date(baseDay.setHours(23, 59, 59, 999));

    /* find booked OT ids in that window (exclude cancelled) */
    const bookedIds = await OTSchedule.distinct("ot", {
      startTime: { $lt: windowEnd },
      endTime:   { $gt: windowStart },
      status:    { $in: ["scheduled", "in-progress"] },
    });

    /* pull all OTs */
    const allOTs = await OperatingTheatre.find({}).sort("otNumber");

    /* decorate with status */
    const decorated = allOTs.map((ot) => ({
      ...ot.toObject(),
      status: bookedIds.includes(ot._id.toString()) ? "booked" : "available",
    }));

    /* optional filter */
    if (status === "booked")
      return res.json(decorated.filter((o) => o.status === "booked"));
    if (status === "available")
      return res.json(decorated.filter((o) => o.status === "available"));

    return res.json(decorated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

/* ─────────────────────────────────────────────────────────────── */
/*  PUT /api/ot-master/:id   |  body = { …fieldsToUpdate } */
exports.updateOT = async (req, res) => {
  try {
    const ot = await OperatingTheatre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!ot) return res.status(404).json({ msg: "OT not found" });
    res.json({ msg: "OT updated", ot });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};