const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getProvidersForMatch } = require("../controllers/watchController");

router.get("/:matchId", authMiddleware, getProvidersForMatch);

module.exports = router;
