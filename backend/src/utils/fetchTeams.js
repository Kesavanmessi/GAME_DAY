const axios = require("axios");
const Team = require("../models/Team");

const LEAGUES = {
  PL: "Premier League",
  PD: "La Liga",
  BL1: "Bundesliga",
  SA: "Serie A",
  FL1: "Ligue 1"
};

async function fetchTeamsForLeague(leagueId) {
  try {
    const url = `https://api.football-data.org/v4/competitions/${leagueId}/teams`;
    const response = await axios.get(url, {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_API_KEY,
      },
    });

    const teams = response.data.teams;

    await Team.deleteMany({ leagueId });

    const formatted = teams.map(team => ({
      teamId: team.id,
      name: team.name,
      shortName: team.shortName,
      tla: team.tla,
      crest: team.crest,
      leagueId
    }));

    await Team.insertMany(formatted);
    console.log(`Updated teams for ${LEAGUES[leagueId]}`);
  } catch (err) {
    console.error(`Error fetching league ${leagueId}:`, err.message);
  }
}

async function updateAllLeagues() {
  for (const id of Object.keys(LEAGUES)) {
    await fetchTeamsForLeague(id);
  }
}

module.exports = { updateAllLeagues };
