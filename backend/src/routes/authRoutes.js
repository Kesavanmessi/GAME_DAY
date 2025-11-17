// backend/src/routes/authRoutes.js

const router = require("express").Router();
const { signup, login } = require("../controllers/authController");

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

module.exports = router;
