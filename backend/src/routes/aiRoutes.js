const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { askAI } = require("../controllers/aiController");

router.post("/ask", authMiddleware, askAI);

module.exports = router;
