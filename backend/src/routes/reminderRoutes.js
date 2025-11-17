// backend/src/routes/reminderRoutes.js

const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
  addReminder, 
  removeReminder, 
  getMyReminders 
} = require("../controllers/reminderController");

// Add reminder
router.post("/add", authMiddleware, addReminder);

// Remove reminder
router.post("/remove", authMiddleware, removeReminder);

// Get all reminders for logged-in user
router.get("/", authMiddleware, getMyReminders);

module.exports = router;
