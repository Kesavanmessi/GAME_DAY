// backend/src/routes/authRoutes.js

const router = require("express").Router();
const { googleLogin } = require("../controllers/authController");

const { updateProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Google Login
router.post("/google", googleLogin);

// Profile aliases matching frontend calls
router.get("/me", authMiddleware, (req, res) => res.json({ user: req.user }));
router.put("/update-profile", authMiddleware, updateProfile);

// Placeholders for missing features to prevent 404s
router.post("/logout", (req, res) => res.json({ message: "Logged out successfully" }));

module.exports = router;
