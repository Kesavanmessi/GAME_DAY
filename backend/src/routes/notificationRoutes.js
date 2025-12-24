const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { getMyNotifications, markAsRead, markAllAsRead } = require("../controllers/notificationController");

router.get("/", auth, getMyNotifications);
router.post("/read/:id", auth, markAsRead);
router.post("/read-all", auth, markAllAsRead);

module.exports = router;
