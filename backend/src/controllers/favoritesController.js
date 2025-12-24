const User = require("../models/User");
const Team = require("../models/Team");

// Add favorite team
exports.addFavorite = async (req, res) => {
  try {
    const { teamId, leagueId, type } = req.body;
    const user = req.user;

    if (!teamId || !leagueId || !type) {
      return res.status(400).json({ message: "teamId, leagueId, type required" });
    }

    // Check if team exists in DB
    const teamExists = await Team.findOne({ teamId, leagueId });
    if (!teamExists) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Remove team from all 3 favorite lists first (avoid duplicates)
    user.publicFavorites = user.publicFavorites.filter(t => t.teamId !== teamId);
    user.privateFavorites = user.privateFavorites.filter(t => t.teamId !== teamId);
    user.veryFavoriteTeams = user.veryFavoriteTeams.filter(t => t.teamId !== teamId);

    // Add team to selected type
    const favObj = { teamId, leagueId };

    if (type === "public") user.publicFavorites.push(favObj);
    if (type === "private") user.privateFavorites.push(favObj);
    if (type === "very") user.veryFavoriteTeams.push(favObj);

    await user.save();

    res.json({
      message: "Favorite updated successfully",
      favorites: {
        public: user.publicFavorites,
        private: user.privateFavorites,
        very: user.veryFavoriteTeams
      }
    });

  } catch (error) {
    console.error("Add Favorite Error:", error);
    res.status(500).json({ message: "Server error adding favorite" });
  }
};

// Remove favorite team
exports.removeFavorite = async (req, res) => {
  try {
    const { teamId } = req.body;
    const user = req.user;

    user.publicFavorites = user.publicFavorites.filter(t => t.teamId !== teamId);
    user.privateFavorites = user.privateFavorites.filter(t => t.teamId !== teamId);
    user.veryFavoriteTeams = user.veryFavoriteTeams.filter(t => t.teamId !== teamId);

    await user.save();

    res.json({
      message: "Favorite removed",
      favorites: {
        public: user.publicFavorites,
        private: user.privateFavorites,
        very: user.veryFavoriteTeams
      }
    });

  } catch (error) {
    console.error("Remove Favorite Error:", error);
    res.status(500).json({ message: "Server error removing favorite" });
  }
};

// Get all favorites
exports.getFavorites = async (req, res) => {
  try {
    const user = req.user;

    // Collect all team IDs
    const allTeamIds = [
      ...user.publicFavorites.map(f => f.teamId),
      ...user.privateFavorites.map(f => f.teamId),
      ...user.veryFavoriteTeams.map(f => f.teamId)
    ];

    // Fetch team details
    const teams = await Team.find({ teamId: { $in: allTeamIds } });
    const teamMap = {};
    teams.forEach(t => teamMap[t.teamId] = t);

    const LEAGUES = {
      PL: "Premier League",
      PD: "La Liga",
      BL1: "Bundesliga",
      SA: "Serie A",
      FL1: "Ligue 1"
    };

    // Helper to enrich favorite objects
    const enrich = (favList, type) => favList.map(f => {
      const team = teamMap[f.teamId];
      return {
        teamId: f.teamId,
        leagueId: f.leagueId,
        leagueName: LEAGUES[f.leagueId] || f.leagueId,
        name: team ? team.name : "Unknown Team",
        crest: team ? team.crest : "",
        shortName: team ? team.shortName : "",
        type, // Add type for frontend convenience
        reminderSettings: f.reminderSettings // Pass settings so frontend knows status
      };
    });

    res.json({
      public: enrich(user.publicFavorites, "public"),
      private: enrich(user.privateFavorites, "private"),
      very: enrich(user.veryFavoriteTeams, "very")
    });

  } catch (error) {
    console.error("Get Favorites Error:", error);
    res.status(500).json({ message: "Server error fetching favorites" });
  }
};


// -----------------------------
// UPDATE TEAM REMINDER SETTINGS
// -----------------------------
exports.updateTeamSettings = async (req, res) => {
  try {
    const { teamId, reminderSettings } = req.body;
    const user = req.user;

    // Helper to update settings in a list
    const updateInList = (list) => {
      const idx = list.findIndex(t => t.teamId === parseInt(teamId));
      if (idx !== -1) {
        list[idx].reminderSettings = reminderSettings;
        return true;
      }
      return false;
    };

    // Try finding and updating in all lists
    const updatedPublic = updateInList(user.publicFavorites);
    const updatedPrivate = updateInList(user.privateFavorites);
    const updatedVery = updateInList(user.veryFavoriteTeams);

    if (!updatedPublic && !updatedPrivate && !updatedVery) {
      return res.status(404).json({ message: "Team not found in favorites" });
    }

    await user.save();

    // Regenerate reminders for this user
    const { regenerateReminders } = require('./reminderController');
    await regenerateReminders(user._id);

    res.json({ message: "Team settings updated" });

  } catch (error) {
    console.error("Update Team Settings Error:", error);
    res.status(500).json({ message: "Server error updating settings" });
  }
};
