const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const matchController = require("../controllers/matchController");
const Match = require("../models/Match");

router.get("/today", authMiddleware, matchController.getTodayMatches);
router.get("/upcoming", authMiddleware, matchController.getUpcomingMatches);
router.get("/dashboard", authMiddleware, matchController.getDashboardMatches);

router.get("/last5/:teamId", authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;

    const matches = await Match.find({
      $or: [
        { "homeTeam.id": parseInt(teamId) },
        { "awayTeam.id": parseInt(teamId) }
      ],
      status: "FINISHED"
    })
      .sort({ utcDate: -1 })
      .limit(5);

    res.json({ matches });
  } catch (err) {
    console.error("Last 5 matches error:", err);
    res.status(500).json({ message: "Failed to fetch matches" });
  }
});

module.exports = router;
