require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB, mongoose } = require("./src/db");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const startScheduler = require("./src/utils/scheduler");

// compression (optional)
let compression;
try {
  compression = require("compression");
} catch (err) {
  console.warn('Optional dependency "compression" not installed.');
  compression = null;
}

// Initialize express app
const app = express();

// ------------------------------
// SECURITY & MIDDLEWARE
// ------------------------------

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
} else {
  app.set("trust proxy", false);
}

app.use((req, res, next) => {
  try {
    let obj = req;
    let desc;

    while (obj && obj !== Object.prototype) {
      desc = Object.getOwnPropertyDescriptor(obj, "query");
      if (desc) break;
      obj = Object.getPrototypeOf(obj);
    }

    if (desc && desc.get && !desc.writable) {
      const current = req.query || {};
      Object.defineProperty(req, "query", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: current,
      });
    }
  } catch (_) {}

  next();
});

app.use(helmet());

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

if (compression) app.use(compression());

// CORS
const devFrontend = process.env.FRONTEND_URL_DEV || "http://localhost:5173";
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : devFrontend,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// ------------------------------
// ROUTES
// ------------------------------

app.get("/", (req, res) => {
  res.json({ message: "GameDay Backend Running..." });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    mongoStatus:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/leagues", require("./src/routes/leagueRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/matches", require("./src/routes/matchRoutes"));
app.use("/api/reminders", require("./src/routes/reminderRoutes"));
app.use("/api/friends", require("./src/routes/friendRoutes"));
app.use("/api/private", require("./src/routes/privateAccessRoutes"));
app.use("/api/ai", require("./src/routes/aiRoutes"));
app.use("/api/watch", require("./src/routes/watchRoutes"));
app.use("/api/access", require("./src/routes/accessRoutes"));
app.use("/api/notifications", require("./src/routes/notificationRoutes"));
app.use("/api/device", require("./src/routes/deviceRoutes"));

// Production static hosting
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
}

// Error handling
const ApiError = require("./src/utils/ApiError");
const errorHandler = require("./src/middleware/errorHandler");

app.use((req, res, next) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});
app.use(errorHandler);

// ------------------------------
// MONGOOSE CONNECTION LOGS
// ------------------------------

mongoose.connection.on("connecting", () => {
  console.log("Mongoose connecting...");
});
mongoose.connection.on("connected", () => {
  console.log(
    new Date().toISOString(),
    "Mongoose connected (readyState=",
    mongoose.connection.readyState,
    ")"
  );
});
mongoose.connection.on("disconnected", () => {
  console.warn(
    new Date().toISOString(),
    "Mongoose disconnected (readyState=",
    mongoose.connection.readyState,
    ")"
  );
});
mongoose.connection.on("error", (err) => {
  console.error(
    new Date().toISOString(),
    "Mongoose connection error:",
    err.message
  );
});

// ------------------------------
// START SERVER AFTER DB CONNECTS
// ------------------------------

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    startScheduler();
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT} 🚀`)
    );
  })
  .catch((err) => console.error("DB Error:", err));
