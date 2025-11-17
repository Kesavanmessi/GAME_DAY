const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  teamId: { type: Number, required: true },
  name: { type: String, required: true },
  shortName: String,
  tla: String,
  crest: String,
  leagueId: { type: String, required: true } // PL, PD, BL1 etc.
});

module.exports = mongoose.model("Team", TeamSchema);
