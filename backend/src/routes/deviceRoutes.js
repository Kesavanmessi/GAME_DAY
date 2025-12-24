const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { registerToken, unregisterToken } = require("../controllers/deviceController");

router.post("/register", auth, registerToken);
router.post("/unregister", auth, unregisterToken);

module.exports = router;
