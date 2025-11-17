const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addFavorite, removeFavorite, getFavorites } = require("../controllers/favoritesController");

// Protected profile
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Add favorite
router.post("/favorites/add", authMiddleware, addFavorite);

// Remove favorite
router.post("/favorites/remove", authMiddleware, removeFavorite);

// Get all favorites
router.get("/favorites", authMiddleware, getFavorites);

module.exports = router;
