const Reminder = require("../models/Reminder");
const Match = require("../models/Match");
const User = require("../models/User");

// ---------------------------
// ADD REMINDER
// ---------------------------
// ---------------------------
// ADD REMINDER
// ---------------------------
exports.addReminder = async (req, res) => {
  try {
    const user = req.user;
    const { matchId, reminderTime } = req.body;
    // Default manual reminders to "push" and "user" origin
    const origin = 'user';
    const deliveryMethod = 'push';

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

    // CONSTRAINT: Manual reminders must be within 24 hours of start
    const earliestAllowed = new Date(matchStartUTC.getTime() - 24 * 60 * 60 * 1000);
    if (reminderDate < earliestAllowed) {
      return res.status(400).json({
        message: "Manual reminders can only be set within 24 hours of match start"
      });
    }

    // CONSTRAINT: Max 2 manual reminders per match
    const existingManual = await Reminder.find({ userId: user._id, matchId, origin: 'user' });
    if (existingManual.length >= 2) {
      return res.status(400).json({ message: "Maximum 2 manual reminders allowed per match" });
    }

    // Add reminder
    await Reminder.create({
      userId: user._id,
      matchId,
      leagueId: match.leagueId,
      reminderTime: reminderDate,
      origin,
      deliveryMethod
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

    // CHECK USER SETTING
    if (!user.matchReminders || user.matchReminders.autoEmail === false) {
      // Auto reminders disabled by user
      return;
    }

    const matchStartUTC = new Date(match.utcDate);
    // Auto reminder is 30 mins before
    const reminderDate = new Date(matchStartUTC.getTime() - 30 * 60 * 1000);

    // check if already exists
    const existing = await Reminder.findOne({
      userId,
      matchId: match.matchId,
      reminderTime: reminderDate,
      origin: 'auto'
    });

    if (existing) return;

    // add auto reminder -> Email
    await Reminder.create({
      userId,
      matchId: match.matchId,
      leagueId: match.leagueId,
      reminderTime: reminderDate,
      origin: 'auto',
      deliveryMethod: 'email'
    });

    console.log(`Auto reminder added for user ${userId} for match ${match.matchId}`);

  } catch (error) {
    console.error("Auto Reminder Error:", error);
  }
};
// ---------------------------
// REGENERATE REMINDERS
// ---------------------------
// ---------------------------
// REGENERATE REMINDERS
// ---------------------------
exports.regenerateReminders = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // 1. Delete all FUTURE AUTO reminders
    const now = new Date();
    await Reminder.deleteMany({
      userId,
      reminderTime: { $gt: now },
      origin: 'auto'
    });

    // 2. Fetch all upcoming matches for favorite teams
    const allFavs = [
      ...user.publicFavorites.map(f => ({ ...f, type: 'public' })),
      ...user.privateFavorites.map(f => ({ ...f, type: 'private' })),
      ...user.veryFavoriteTeams.map(f => ({ ...f, type: 'very' }))
    ];

    // Create Map for easy lookup: teamId -> favoriteObject
    const favMap = {};
    allFavs.forEach(f => favMap[f.teamId] = f);

    const favoriteTeamIds = Object.keys(favMap).map(Number);
    if (favoriteTeamIds.length === 0) return;

    // Find upcoming matches
    const upcomingMatches = await Match.find({
      $or: [{ "homeTeam.id": { $in: favoriteTeamIds } }, { "awayTeam.id": { $in: favoriteTeamIds } }],
      utcDate: { $gt: now.toISOString() }
    });

    const savedReminders = [];
    const globalSettings = user.reminderSettings || { enabled: true, slots: [] };

    for (const match of upcomingMatches) {
      // Determine which settings to use
      const homeFav = favMap[match.homeTeam.id];
      const awayFav = favMap[match.awayTeam.id];

      let selectedFav = null;

      // CONFLICT RESOLUTION: If both are favorites, pick random
      if (homeFav && awayFav) {
        selectedFav = Math.random() < 0.5 ? homeFav : awayFav;
        console.log(`[Regen] Conflict for match ${match.matchId}: Selected ${selectedFav.teamId}`);
      } else {
        selectedFav = homeFav || awayFav;
      }

      // Determine effective settings
      // Order: Team Specific > Global
      let settingsToUse = globalSettings;

      // If team has specific settings valid object, use it
      if (selectedFav && selectedFav.reminderSettings && selectedFav.reminderSettings.enabled !== null && selectedFav.reminderSettings.enabled !== undefined) {
        // Found specific settings
        settingsToUse = selectedFav.reminderSettings;
      }

      // Check if enabled
      if (settingsToUse.enabled === false) continue;

      const slots = settingsToUse.slots || [];
      const matchStart = new Date(match.utcDate);

      for (const slot of slots) {
        if (!slot.enabled) continue;

        const reminderTime = new Date(matchStart.getTime() - slot.minutesBefore * 60000);

        if (reminderTime <= now) continue;

        savedReminders.push({
          userId,
          matchId: match.matchId,
          leagueId: match.leagueId,
          reminderTime: reminderTime,
          origin: 'auto',
          deliveryMethod: slot.deliveryMethod
        });
      }
    }

    if (savedReminders.length > 0) {
      await Reminder.insertMany(savedReminders);
      console.log(`[Regen] Created ${savedReminders.length} reminders for user ${userId}`);
    }

  } catch (error) {
    console.error("Regenerate Reminders Error:", error);
  }
};
