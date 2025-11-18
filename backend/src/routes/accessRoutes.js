const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  requestPrivateAccess,
  handleAccessRequest,
  checkAccessStatus,
  getMyAccessRequests
} = require("../controllers/accessController");

router.post("/request", auth, requestPrivateAccess);
router.post("/handle", auth, handleAccessRequest);
router.get("/status/:friendId", auth, checkAccessStatus);
router.get("/my-requests", auth, getMyAccessRequests);

module.exports = router;
