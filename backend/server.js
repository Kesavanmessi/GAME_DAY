require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Scheduler
const startScheduler = require("./src/utils/scheduler");

// Test route
app.get("/", (req, res) => {
  res.json({ message: "GameDay Backend Running..." });
});

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/leagues", require("./src/routes/leagueRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/matches", require("./src/routes/matchRoutes"));
app.use("/api/reminders", require("./src/routes/reminderRoutes"));
app.use("/api/friends", require("./src/routes/friendRoutes"));
app.use("/api/private", require("./src/routes/privateAccessRoutes"));




// Connect DB + Start Server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    startScheduler();  // <-- MUST be a function
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB Error:", err));
