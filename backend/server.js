require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "GameDay Backend Running..." });
});

// Main routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/leagues", require("./src/routes/leagueRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));

// Connect DB + Start Server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB Error:", err));
