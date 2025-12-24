const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  sendFriendRequest,
  handleFriendRequest,
  getFriendsList,
  getPendingRequests,
  getFriendPublicFavorites,
  getFriendProfile
} = require("../controllers/friendController");

// Send friend request
router.post("/request", authMiddleware, sendFriendRequest);
router.post("/send-request", authMiddleware, sendFriendRequest); // Alias

// Handle friend request (accept/reject)
router.post("/handle-request", authMiddleware, handleFriendRequest);
router.post("/accept", authMiddleware, handleFriendRequest); // Alias

// Get all friends
router.get("/list", authMiddleware, getFriendsList);

// Get pending requests
router.get("/requests", authMiddleware, getPendingRequests);

// Get friend's public favorites
router.get("/favorites/:friendId", authMiddleware, getFriendPublicFavorites);

// Get friend profile
router.get("/profile/:friendId", authMiddleware, getFriendProfile);

module.exports = router;
