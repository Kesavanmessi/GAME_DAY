require("dotenv").config();
const { connectDB, mongoose } = require("../src/db");
const User = require("../src/models/User");
const Notification = require("../src/models/Notification");

async function run() {
    try {
        console.log("Connecting to DB...");
        await connectDB();
        console.log("Connected.");

        const user = await User.findOne();
        if (!user) {
            console.log("No users found.");
            process.exit(0);
        }

        console.log("Found user:", user._id, user.name);

        console.log("Fetching notifications for user...");
        const notifications = await Notification.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(20);

        console.log("Notifications found:", notifications.length);
        console.log("First notification:", notifications[0]);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

run();
