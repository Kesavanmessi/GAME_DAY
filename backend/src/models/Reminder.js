const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  matchId: { type: Number, required: true },
  leagueId: { type: String, required: true },

  // Reminder time in UTC format
  reminderTime: { type: Date, required: true },

  // Has reminder been sent or not
  sent: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model("Reminder", ReminderSchema);
