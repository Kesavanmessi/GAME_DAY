const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getTodayMatches } = require("../controllers/matchController");

router.get("/today", authMiddleware, getTodayMatches);

router.get("/last5/:teamId", authMiddleware, async (req, res) => {
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
});


module.exports = router;
