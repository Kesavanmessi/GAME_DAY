// backend/src/utils/scheduler.js
const cron = require("node-cron");
const { updateAllLeagues } = require("./fetchTeams");
const { updateAllMatches } = require("./fetchMatches");
const mongoose = require('mongoose');
const Reminder = require("../models/Reminder");
const User = require("../models/User");
const sendReminderEmail = require("./mailer");
const { sendPushToUser } = require("./pushSender");

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
  // We'll create the scheduled tasks only when mongoose reports connected.
  let teamTask = null;
  let matchTask = null;
  let reminderTask = null;

  function startTasks() {
    if (teamTask || matchTask || reminderTask) return; // already started

    // Weekly update (every Monday at 01:00)
    teamTask = cron.schedule("0 1 * * 1", async () => {
      try {
        console.log("[Scheduler] Updating teams...");
        await updateAllLeagues();
        console.log("[Scheduler] Team update finished.");
      } catch (err) {
        console.error("[Scheduler] Error updating teams:", err);
      }
    });

    // Daily update matches (every day at 01:05)
    matchTask = cron.schedule("5 1 * * *", async () => {
      try {
        console.log("[Scheduler] Updating matches...");
        await updateAllMatches();
        console.log("[Scheduler] Match update finished.");
      } catch (err) {
        console.error("[Scheduler] Error updating matches:", err);
      }
    });

    // Check reminders every minute
    reminderTask = cron.schedule("* * * * *", async () => {
      try {
        const now = new Date();
        // console.log(`[Scheduler] Checking reminders at ${now.toISOString()}`);

        // If mongoose is not connected, skip this run to avoid buffering timeouts
        if (mongoose.connection.readyState !== 1) {
          return;
        }

        // Try fetching due reminders. If we hit a buffering timeout, retry once after 5s.
        let dueReminders;
        try {
          dueReminders = await Reminder.find({
            sent: false,
            reminderTime: { $lte: now }
          });
        } catch (findErr) {
          const msg = (findErr && findErr.message) || '';
          if (msg.includes('buffering timed out') || msg.includes('bufferTimeout')) {
            // wait 5 seconds and try once more
            await new Promise(res => setTimeout(res, 5000));
            try {
              dueReminders = await Reminder.find({
                sent: false,
                reminderTime: { $lte: now }
              });
            } catch (retryErr) {
              console.error('[Scheduler] Retry Reminder.find failed:', retryErr);
              return; // give up this run
            }
          } else {
            // non-buffering error; rethrow to outer handler
            throw findErr;
          }
        }

        if (!dueReminders || dueReminders.length === 0) {
          return;
        }

        for (const reminder of dueReminders) {
          try {
            const user = await User.findById(reminder.userId);
            if (!user) {
              continue;
            }

            // DELIVERY METHOD: EMAIL
            if (reminder.deliveryMethod === 'email') {
              const subject = "GameDay — Match Reminder ⚽";
              const text = `Hi ${user.name || "Fan"},\n\nYour match (ID: ${reminder.matchId}) is starting soon! Don't miss it.\n\nRegards,\nGameDay`;
              await sendReminderEmail(user.email, subject, text);
              console.log(`[Scheduler] Email reminder ${reminder._id} sent to ${user.email}`);
            }
            // DELIVERY METHOD: PUSH
            else {
              // Default to Push if not specified or explicitly 'push'
              const title = "Match Starting Soon! ⚽";
              const body = `Your match is about to begin. Tune in now!`;
              await sendPushToUser(user._id, { title, body });
              console.log(`[Scheduler] Push reminder ${reminder._id} sent to user ${user._id}`);
            }

            // Mark as sent
            reminder.sent = true;
            await reminder.save();

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

  function stopTasks() {
    try {
      if (teamTask) { teamTask.stop(); teamTask = null; }
      if (matchTask) { matchTask.stop(); matchTask = null; }
      if (reminderTask) { reminderTask.stop(); reminderTask = null; }
      console.log('Scheduler tasks stopped.');
    } catch (stopErr) {
      console.error('Error stopping scheduler tasks:', stopErr);
    }
  }

  // Start immediately if already connected, otherwise wait for connection
  if (mongoose.connection.readyState === 1) {
    startTasks();
  } else {
    console.log('[Scheduler] Waiting for mongoose connection before scheduling tasks...');
    mongoose.connection.once('connected', () => {
      console.log('[Scheduler] Mongoose connected event received, starting tasks.');
      startTasks();
    });
  }

  // If we disconnect later, stop tasks to avoid running while disconnected
  mongoose.connection.on('disconnected', () => {
    console.warn('[Scheduler] Mongoose disconnected: stopping scheduled tasks.');
    stopTasks();
  });
}

module.exports = startScheduler;
