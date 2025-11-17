const router = require("express").Router();
const { updateAllLeagues } = require("../utils/fetchTeams");

router.get("/update-leagues", async (req, res) => {
  try {
    await updateAllLeagues();
    res.json({ message: "All leagues updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;
