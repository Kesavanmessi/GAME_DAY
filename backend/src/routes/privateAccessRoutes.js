const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  requestPrivateAccess,
  acceptPrivateAccess,
  getFriendPrivateFavorites
} = require("../controllers/privateAccessController");

// Send access request
router.post("/request", authMiddleware, requestPrivateAccess);

// Accept access request
router.post("/accept", authMiddleware, acceptPrivateAccess);

// View private favorites (IF approved)
router.get("/view/:friendId", authMiddleware, getFriendPrivateFavorites);

module.exports = router;
