const mongoose = require('mongoose');
const path = require('path');
// Try loading from current directory (backend root)
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
// If running from backend root, __dirname is src/scripts, so ../../.env is correct relative to file.

const Match = require('../models/Match');
const User = require('../models/User');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error("MONGO_URI is undefined. Check .env path.");
            // process.env.PWD might help debugging
            console.log("CWD:", process.cwd());
            process.exit(1);
        }
        await mongoose.connect(uri);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("Connection error", err);
        process.exit(1);
    }
};

const run = async () => {
    await connectDB();

    const today = new Date().toISOString();
    console.log("Current Date (ISO):", today);

    const totalMatches = await Match.countDocuments({});
    console.log("Total Matches in DB:", totalMatches);

    const futureMatches = await Match.countDocuments({ utcDate: { $gte: today } });
    console.log("Future Matches (>= today):", futureMatches);

    if (futureMatches > 0) {
        const sample = await Match.findOne({ utcDate: { $gte: today } });
        console.log("Sample Future Match:", JSON.stringify(sample, null, 2));
    } else {
        const lastMatch = await Match.findOne().sort({ utcDate: -1 });
        console.log("Last Match in DB:", JSON.stringify(lastMatch, null, 2));
    }

    // Check Users
    const users = await User.find({});
    console.log("Total Users:", users.length);
    for (const u of users) {
        const favCount = (u.publicFavorites?.length || 0) + (u.privateFavorites?.length || 0) + (u.veryFavoriteTeams?.length || 0);
        console.log(`User: ${u.email}, Favorites Count: ${favCount}`);
        if (favCount > 0) {
            console.log("Favorites Sample:", JSON.stringify({
                public: u.publicFavorites,
                private: u.privateFavorites,
                very: u.veryFavoriteTeams
            }, null, 2));
        }
    }

    process.exit();
};

run();
