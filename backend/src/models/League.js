const mongoose = require("mongoose");

const LeagueSchema = new mongoose.Schema({
  leagueId: { type: String, required: true, unique: true }, // PL, PD, BL1, SA, FL1
  name: { type: String, required: true },
  country: { type: String, required: true }
});

module.exports = mongoose.model("League", LeagueSchema);
