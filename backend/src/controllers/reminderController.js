const Reminder = require("../models/Reminder");
const Match = require("../models/Match");
const User = require("../models/User");

// ---------------------------
// ADD REMINDER
// ---------------------------
exports.addReminder = async (req, res) => {
  try {
    const user = req.user;
    const { matchId, reminderTime } = req.body;

    if (!matchId || !reminderTime) {
      return res.status(400).json({ message: "matchId and reminderTime required" });
    }

    // Find match
    const match = await Match.findOne({ matchId });
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const matchStartUTC = new Date(match.utcDate);
    const reminderDate = new Date(reminderTime);

    // Check reminderTime < match start
    if (reminderDate >= matchStartUTC) {
      return res.status(400).json({ message: "Reminder must be before match start" });
    }

    // Check reminderTime >= matchStart - 5 hours
    const earliestAllowed = new Date(matchStartUTC.getTime() - 5 * 60 * 60 * 1000);
    if (reminderDate < earliestAllowed) {
      return res.status(400).json({
        message: "Reminders allowed only within 5 hours before match start"
      });
    }

    // Check maximum 3 reminders per match
    const existing = await Reminder.find({ userId: user._id, matchId });
    if (existing.length >= 3) {
      return res.status(400).json({ message: "Maximum 3 reminders allowed per match" });
    }

    // Add reminder
    await Reminder.create({
      userId: user._id,
      matchId,
      leagueId: match.leagueId,
      reminderTime: reminderDate,
    });

    res.json({ message: "Reminder added successfully" });

  } catch (error) {
    console.error("Add Reminder Error:", error);
    res.status(500).json({ message: "Server error adding reminder" });
  }
};

// ---------------------------
// REMOVE REMINDER
// ---------------------------
exports.removeReminder = async (req, res) => {
  try {
    const user = req.user;
    const { reminderId } = req.body;

    await Reminder.deleteOne({ _id: reminderId, userId: user._id });

    res.json({ message: "Reminder removed" });

  } catch (error) {
    console.error("Remove Reminder Error:", error);
    res.status(500).json({ message: "Server error removing reminder" });
  }
};

// ---------------------------
// GET USER REMINDERS
// ---------------------------
exports.getMyReminders = async (req, res) => {
  try {
    const user = req.user;

    const reminders = await Reminder.find({ userId: user._id }).sort({ reminderTime: 1 });

    res.json(reminders);

  } catch (error) {
    console.error("Get Reminders Error:", error);
    res.status(500).json({ message: "Failed to fetch reminders" });
  }
};

// ---------------------------
// AUTO-CREATE 30 MIN REMINDER FOR VERY FAVORITE
// ---------------------------
exports.autoCreateVeryFavoriteReminders = async (userId, match) => {
  try {
    const user = await User.findById(userId);

    // check if match belongs to very favorite teams
    const isVeryFav = user.veryFavoriteTeams.some(t => t.teamId === match.homeTeam.id || t.teamId === match.awayTeam.id);
    if (!isVeryFav) return;

    const matchStartUTC = new Date(match.utcDate);
    const reminderDate = new Date(matchStartUTC.getTime() - 30 * 60 * 1000);

    // check if already exists
    const existing = await Reminder.findOne({
      userId,
      matchId: match.matchId,
      reminderTime: reminderDate
    });

    if (existing) return;

    // add auto reminder
    await Reminder.create({
      userId,
      matchId: match.matchId,
      leagueId: match.leagueId,
      reminderTime,
    });

    console.log(`Auto reminder added for user ${userId} for match ${match.matchId}`);

  } catch (error) {
    console.error("Auto Reminder Error:", error);
  }
};
