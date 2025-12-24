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

// Get upcoming matches (next 7 days)
exports.getUpcomingMatches = async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const matches = await Match.find({
      utcDate: {
        $gte: today.toISOString(),
        $lte: nextWeek.toISOString()
      }
    }).sort({ utcDate: 1 });

    res.json({ matches });

  } catch (err) {
    console.error("Upcoming matches error:", err);
    res.status(500).json({ message: "Failed to fetch upcoming matches" });
  }
};

// Get dashboard matches (next 3 matches for each favorite team)
exports.getDashboardMatches = async (req, res) => {
  try {
    const user = req.user;
    const today = new Date().toISOString();

    // Collect all unique team IDs from favorites
    const favoriteTeamIds = [
      ...user.publicFavorites.map(f => f.teamId),
      ...user.privateFavorites.map(f => f.teamId),
      ...user.veryFavoriteTeams.map(f => f.teamId)
    ];

    const uniqueTeamIds = [...new Set(favoriteTeamIds)];

    if (uniqueTeamIds.length === 0) {
      return res.json({ matches: [] });
    }

    let allMatches = [];

    // Fetch next 3 matches for each team
    // Note: This could be optimized with a single complex query, but loop is simpler for "next 3 per team" logic
    for (const teamId of uniqueTeamIds) {
      const teamMatches = await Match.find({
        $or: [{ "homeTeam.id": teamId }, { "awayTeam.id": teamId }],
        utcDate: { $gte: today }
      })
        .sort({ utcDate: 1 })
        .sort({ utcDate: 1 })
        .limit(4);

      allMatches.push(...teamMatches);
    }

    // Remove duplicates (e.g. if two favorite teams play each other)
    const uniqueMatches = Array.from(new Set(allMatches.map(m => m.matchId)))
      .map(id => allMatches.find(m => m.matchId === id));

    // Sort by date
    uniqueMatches.sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));

    res.json({ matches: uniqueMatches });

  } catch (err) {
    console.error("Dashboard matches error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard matches" });
  }
};
