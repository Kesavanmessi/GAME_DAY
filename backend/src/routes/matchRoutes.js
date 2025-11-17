const router = require("express").Router();
const Match = require("../models/Match");

// All upcoming matches
router.get("/upcoming", async (req, res) => {
  const matches = await Match.find().sort({ utcDate: 1 });
  res.json(matches);
});

// Today's matches
router.get("/today", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const matches = await Match.find({
    utcDate: { $regex: today }
  });

  res.json(matches);
});

// Matches for specific team
router.get("/team/:teamId", async (req, res) => {
  const { teamId } = req.params;
  const matches = await Match.find({
    $or: [
      { "homeTeam.id": teamId },
      { "awayTeam.id": teamId }
    ]
  });

  res.json(matches);
});

module.exports = router;
