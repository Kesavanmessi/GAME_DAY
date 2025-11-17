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

    res.json({
      public: user.publicFavorites,
      private: user.privateFavorites,
      very: user.veryFavoriteTeams
    });

  } catch (error) {
    console.error("Get Favorites Error:", error);
    res.status(500).json({ message: "Server error fetching favorites" });
  }
};
