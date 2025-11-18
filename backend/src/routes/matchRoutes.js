const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getTodayMatches } = require("../controllers/matchController");

router.get("/today", authMiddleware, getTodayMatches);

module.exports = router;
