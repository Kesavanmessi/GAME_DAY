const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addFavorite, removeFavorite, getFavorites } = require("../controllers/favoritesController");
const { updateProfile } = require("../controllers/userController");

// Protected profile
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Update Profile
router.post("/update", authMiddleware, updateProfile);

// Check Username Availability
router.post("/check-username", require("../controllers/userController").checkUsernameAvailability);

// Change Password - REMOVED (Google Auth only)
// router.post("/change-password", authMiddleware, changePassword);

// Add favorite
router.post("/favorites/add", authMiddleware, addFavorite);

// Remove favorite
router.post("/favorites/remove", authMiddleware, removeFavorite);

// Get all favorites
router.get("/favorites", authMiddleware, getFavorites);

// Aliases for frontend consistency
router.get("/me", authMiddleware, (req, res) => res.json({ user: req.user }));
router.get("/my-favorites", authMiddleware, getFavorites);
router.post("/remove-favorite", authMiddleware, removeFavorite); // Frontend calls this sometimes

module.exports = router;
