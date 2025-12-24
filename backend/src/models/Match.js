const { mongoose } = require("../db");


const MatchSchema = new mongoose.Schema({
  matchId: Number,
  leagueId: String,
  homeTeam: {
    id: Number,
    name: String,
  },
  awayTeam: {
    id: Number,
    name: String,
  },
  utcDate: String,
  status: String,
});

module.exports = mongoose.model("Match", MatchSchema);
