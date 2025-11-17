const cron = require("node-cron");
const { updateAllLeagues } = require("./fetchTeams");
const { updateAllMatches } = require("./fetchMatches");

function startScheduler() {
  console.log("Scheduler started...");

  // Weekly update (every Monday 1 AM)
  cron.schedule("0 1 * * 1", async () => {
    console.log("Updating teams...");
    await updateAllLeagues();
  });

  // Daily update matches (every day at 1:05 AM)
  cron.schedule("5 1 * * *", async () => {
    console.log("Updating matches...");
    await updateAllMatches();
  });
}

module.exports = startScheduler;
