// backend/src/routes/userRoutes.js

const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// PROTECTED ROUTE — only logged in users can access
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = req.user;  // injected by middleware
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Failed to load profile" });
  }
});

module.exports = router;
