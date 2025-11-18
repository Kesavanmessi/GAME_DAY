const Match = require("../models/Match");

// Get today's matches (based on UTC)
exports.getTodayMatches = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const matches = await Match.find({
      utcDate: { $regex: today }
    }).sort({ utcDate: 1 });

    res.json({ matches });

  } catch (err) {
    console.error("Today matches error:", err);
    res.status(500).json({ message: "Failed to fetch today's matches" });
  }
};
