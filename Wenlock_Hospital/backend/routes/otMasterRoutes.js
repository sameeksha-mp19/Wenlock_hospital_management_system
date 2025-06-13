// routes/otMasterRoutes.js
const router       = require("express").Router();
const { verifyAdmin } = require("../middleware/auth");   // ✅ correct path
const ctrl         = require("../controllers/otMasterController");

router.use(verifyAdmin);
router.post("/",  ctrl.createOT);
router.get("/",   ctrl.listOTs);
router.put("/:id", ctrl.updateOT);

module.exports = router;