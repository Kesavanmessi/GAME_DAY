const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { updateAllMatches } = require('../utils/fetchMatches');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected for seeding...");
    } catch (err) {
        console.error("Connection error", err);
        process.exit(1);
    }
};

const run = async () => {
    console.log("Starting manual match update...");
    await connectDB();

    // Check if API key is present
    if (!process.env.FOOTBALL_API_KEY || process.env.FOOTBALL_API_KEY === "YOUR_API_KEY") {
        console.error("FATAL: FOOTBALL_API_KEY is missing or invalid in .env");
        process.exit(1);
    }

    try {
        await updateAllMatches();
        console.log("Match update completed successfully (check logs above for details).");
    } catch (error) {
        console.error("Match update failed:", error);
    }

    process.exit();
};

run();
