// backend/src/services/aiService.js
const Team = require("../models/Team");
const Match = require("../models/Match");
const User = require("../models/User");

// Simple watch provider mapping (seed). You can expand later or move to DB.
const WATCH_PROVIDERS = {
  IN: { name: "India", providers: ["JioCinema", "SonyLIV", "Star Sports"] },
  US: { name: "USA", providers: ["ESPN+", "Peacock", "fuboTV"] },
  GB: { name: "UK", providers: ["Sky Sports", "BT Sport"] },
  Default: { name: "Global", providers: ["YouTube/Official Broadcaster"] }
};

// Helper: find team by fuzzy name (case-insensitive contains in name, shortName, tla)
async function findTeamByName(input) {
  if (!input) return null;
  const q = input.toLowerCase();
  // look for exact match then contains
  let team = await Team.findOne({
    $or: [
      { name: { $regex: new RegExp("^" + escapeRegex(input) + "$", "i") } },
      { shortName: { $regex: new RegExp("^" + escapeRegex(input) + "$", "i") } },
      { tla: { $regex: new RegExp("^" + escapeRegex(input) + "$", "i") } }
    ]
  });
  if (team) return team;
  // fallback: contains in name/shortName
  team = await Team.findOne({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { shortName: { $regex: q, $options: "i" } },
      { tla: { $regex: q, $options: "i" } }
    ]
  });
  return team;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Get next upcoming match for a team (by teamId)
async function getNextMatchForTeam(teamId) {
  const now = new Date().toISOString();
  const match = await Match.findOne({
    leagueId: { $exists: true },
    $or: [{ "homeTeam.id": teamId }, { "awayTeam.id": teamId }],
    utcDate: { $gte: now }
  }).sort({ utcDate: 1 });
  return match;
}

// Get last N finished matches for a team (by teamId)
async function getLastMatchesForTeam(teamId, limit = 5) {
  // status could be FINISHED or similar
  const matches = await Match.find({
    $or: [{ "homeTeam.id": teamId }, { "awayTeam.id": teamId }],
    status: { $in: ["FINISHED", "FINISHED_AFTER_EXTRA_TIME", "FINISHED_AFTER_PENALTIES"] }
  }).sort({ utcDate: -1 }).limit(limit);
  return matches;
}

// Get today's matches (converted by date substring)
async function getTodaysMatches() {
  const today = new Date().toISOString().split("T")[0];
  const matches = await Match.find({ utcDate: { $regex: today } }).sort({ utcDate: 1 });
  return matches;
}

// Get matches for user's favorite teams for a given day range (optional)
async function getMatchesForUserFavorites(userId, daysAhead = 7) {
  const user = await User.findById(userId);
  if (!user) return [];
  const favoriteTeamIds = [
    ...user.publicFavorites.map(t => t.teamId),
    ...user.privateFavorites.map(t => t.teamId),
    ...user.veryFavoriteTeams.map(t => t.teamId)
  ].filter(Boolean);

  const now = new Date();
  const until = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000).toISOString();

  const matches = await Match.find({
    utcDate: { $gte: now.toISOString(), $lte: until },
    $or: [
      { "homeTeam.id": { $in: favoriteTeamIds } },
      { "awayTeam.id": { $in: favoriteTeamIds } }
    ]
  }).sort({ utcDate: 1 });

  return matches;
}

// Determine watch providers by country code (two-letter)
function getWatchProvidersByCountry(countryCode) {
  if (!countryCode) return WATCH_PROVIDERS.Default;
  const code = countryCode.toUpperCase();
  return WATCH_PROVIDERS[code] || WATCH_PROVIDERS.Default;
}

module.exports = {
  findTeamByName,
  getNextMatchForTeam,
  getLastMatchesForTeam,
  getTodaysMatches,
  getMatchesForUserFavorites,
  getWatchProvidersByCountry
};
