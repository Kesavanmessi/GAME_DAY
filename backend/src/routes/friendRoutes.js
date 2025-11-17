const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
  sendFriendRequest, 
  acceptFriendRequest, 
  getFriendsList,
  getFriendPublicFavorites 
} = require("../controllers/friendController");

// Send friend request
router.post("/request", authMiddleware, sendFriendRequest);

// Accept friend request
router.post("/accept", authMiddleware, acceptFriendRequest);

// Get all friends
router.get("/list", authMiddleware, getFriendsList);

// Get friend's public favorites
router.get("/favorites/:friendId", authMiddleware, getFriendPublicFavorites);

module.exports = router;
