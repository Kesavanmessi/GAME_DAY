// backend/src/routes/leagueRoutes.js
const router = require("express").Router();
const Team = require("../models/Team");

const LEAGUES = [
  { id: "PL", name: "Premier League", country: "England" },
  { id: "PD", name: "La Liga", country: "Spain" },
  { id: "BL1", name: "Bundesliga", country: "Germany" },
  { id: "SA", name: "Serie A", country: "Italy" },
  { id: "FL1", name: "Ligue 1", country: "France" },
];

// GET all leagues
router.get("/", (req, res) => {
  res.json(LEAGUES);
});

// GET clubs in a specific league
router.get("/:leagueId/clubs", async (req, res) => {
  try {
    const { leagueId } = req.params;

    const teams = await Team.find({ leagueId });

    return res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

exports.getTeamById = async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findOne({ teamId: parseInt(teamId) });

  if (!team) return res.status(404).json({ message: "Team not found" });

  res.json({ team });
};


router.get("/team/:teamId", getTeamById);


module.exports = router;
