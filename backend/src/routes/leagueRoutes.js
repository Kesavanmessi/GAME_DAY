// backend/src/routes/leagueRoutes.js
const router = require("express").Router();
const Team = require("../models/Team");

const LEAGUES = [
  {
    id: "PL",
    name: "Premier League",
    country: "England",
    logo: "https://media.api-sports.io/football/leagues/39.png"
  },
  {
    id: "PD",
    name: "La Liga",
    country: "Spain",
    logo: "https://media.api-sports.io/football/leagues/140.png"
  },
  {
    id: "BL1",
    name: "Bundesliga",
    country: "Germany",
    logo: "https://media.api-sports.io/football/leagues/78.png"
  },
  {
    id: "SA",
    name: "Serie A",
    country: "Italy",
    logo: "https://media.api-sports.io/football/leagues/135.png"
  },
  {
    id: "FL1",
    name: "Ligue 1",
    country: "France",
    logo: "https://media.api-sports.io/football/leagues/61.png"
  },
];

// GET all leagues
router.get("/", (req, res) => {
  res.json({ leagues: LEAGUES });
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

const getTeamById = async (req, res) => {
  const { teamId } = req.params;
  const team = await Team.findOne({ teamId: parseInt(teamId) });
  if (!team) return res.status(404).json({ message: "Team not found" });
  res.json({ team });
};


router.get("/team/:teamId", getTeamById);

// Aliases
router.get("/all", (req, res) => res.json({ leagues: LEAGUES }));

router.get("/:leagueId", async (req, res) => {
  try {
    const { leagueId } = req.params;
    const leagueInfo = LEAGUES.find(l => l.id === leagueId);

    if (!leagueInfo) {
      return res.status(404).json({ message: "League not found" });
    }

    const teams = await Team.find({ leagueId });

    return res.json({
      league: {
        ...leagueInfo,
        teams
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

module.exports = router;
