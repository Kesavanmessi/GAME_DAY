const cron = require("node-cron");
const { updateAllLeagues } = require("./fetchTeams");

function startScheduler() {
  console.log("Scheduler started...");

  // Runs every Monday at 1 AM
  cron.schedule("0 1 * * 1", async () => {
    console.log("Updating all leagues...");
    await updateAllLeagues();
  });
}

module.exports = startScheduler;
