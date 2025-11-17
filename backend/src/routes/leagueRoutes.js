const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("All leagues route");
});

router.get("/:leagueId/clubs", (req, res) => {
  res.send("Clubs in league route");
});

module.exports = router;
