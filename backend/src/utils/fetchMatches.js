const axios = require("axios");
const Match = require("../models/Match");

const LEAGUES = ["PL", "PD", "BL1", "SA", "FL1"];

async function fetchMatchesForLeague(leagueId) {
  try {
    const url = `https://api.football-data.org/v4/competitions/${leagueId}/matches?status=SCHEDULED`;
    
    const response = await axios.get(url, {
      headers: { "X-Auth-Token": process.env.FOOTBALL_API_KEY },
    });

    const matches = response.data.matches;

    // remove old matches for league
    await Match.deleteMany({ leagueId });

    const formatted = matches.map(m => ({
      matchId: m.id,
      leagueId,
      homeTeam: {
        id: m.homeTeam.id,
        name: m.homeTeam.name,
      },
      awayTeam: {
        id: m.awayTeam.id,
        name: m.awayTeam.name,
      },
      utcDate: m.utcDate,
      status: m.status,
    }));

    await Match.insertMany(formatted);
    console.log(`Matches updated for league ${leagueId}`);

  } catch (error) {
    console.error(`Match fetching failed for ${leagueId}:`, error.message);
  }
}

async function updateAllMatches() {
  for (const league of LEAGUES) {
    await fetchMatchesForLeague(league);
  }
}

module.exports = { updateAllMatches };
