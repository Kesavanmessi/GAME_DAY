// backend/src/utils/scheduler.js
const cron = require("node-cron");
const { updateAllLeagues } = require("./fetchTeams");
const { updateAllMatches } = require("./fetchMatches");
const Reminder = require("../models/Reminder");
const User = require("../models/User");
const sendReminderEmail = require("./mailer");

/**
 * startScheduler
 * - schedules weekly teams update
 * - schedules daily matches update
 * - schedules minute-based reminder sender
 *
 * Call this AFTER mongoose.connect(...) in server.js
 */
function startScheduler() {
  console.log("Scheduler started...");

  // Weekly update (every Monday at 01:00)
  cron.schedule("0 1 * * 1", async () => {
    try {
      console.log("[Scheduler] Updating teams...");
      await updateAllLeagues();
      console.log("[Scheduler] Team update finished.");
    } catch (err) {
      console.error("[Scheduler] Error updating teams:", err);
    }
  });

  // Daily update matches (every day at 01:05)
  cron.schedule("5 1 * * *", async () => {
    try {
      console.log("[Scheduler] Updating matches...");
      await updateAllMatches();
      console.log("[Scheduler] Match update finished.");
    } catch (err) {
      console.error("[Scheduler] Error updating matches:", err);
    }
  });

  // Check reminders every minute
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      console.log(`[Scheduler] Checking reminders at ${now.toISOString()}`);

      const dueReminders = await Reminder.find({
        sent: false,
        reminderTime: { $lte: now }
      });

      if (!dueReminders || dueReminders.length === 0) {
        // nothing to do
        return;
      }

      for (const reminder of dueReminders) {
        try {
          const user = await User.findById(reminder.userId);
          if (!user) {
            console.warn(`[Scheduler] User not found for reminder ${reminder._id}`);
            // mark as sent to avoid infinite loop? (optional)
            continue;
          }

          // Create friendly email content (you can expand with match details)
          const subject = "GameDay — Match Reminder ⚽";
          const text = `Hi ${user.name || ""},\n\nYour match (ID: ${reminder.matchId}) is starting soon.\n\nRegards,\nGameDay`;

          await sendReminderEmail(user.email, subject, text);

          // Mark as sent
          reminder.sent = true;
          await reminder.save();

          console.log(`[Scheduler] Reminder ${reminder._id} sent to ${user.email}`);
        } catch (innerErr) {
          console.error(`[Scheduler] Failed to process reminder ${reminder._id}:`, innerErr);
        }
      }
    } catch (err) {
      console.error("[Scheduler] Reminder Cron Error:", err);
    }
  });

  console.log("Scheduler tasks scheduled.");
}

module.exports = startScheduler;
