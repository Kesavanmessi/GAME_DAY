const { mongoose } = require("../db");


const ReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  matchId: { type: Number, required: true },
  leagueId: { type: String, required: true },

  // Reminder time in UTC format
  reminderTime: { type: Date, required: true },

  // Has reminder been sent or not
  sent: { type: Boolean, default: false },
  deliveryMethod: {
  type: String,
  enum: ["email", "push"],
  default: "push"
},
// also optionally:
origin: { type: String, enum: ['auto','user'], default: 'user' }

}, { timestamps: true });

module.exports = mongoose.model("Reminder", ReminderSchema);
