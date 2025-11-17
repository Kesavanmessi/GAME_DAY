const router = require("express").Router();

router.post("/signup", (req, res) => {
  res.send("Signup route");
});

router.post("/login", (req, res) => {
  res.send("Login route");
});

module.exports = router;
