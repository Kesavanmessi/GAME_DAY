const User = require("../models/User");


// --------------------------
// CHECK USERNAME AVAILABILITY
// --------------------------
exports.checkUsernameAvailability = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username || username.length < 5) {
            return res.status(400).json({ message: "Username must be at least 5 characters" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "Username is already taken", available: false });
        }

        res.json({ message: "Username is available", available: true });
    } catch (error) {
        console.error("Check Username Error:", error);
        res.status(500).json({ message: "Server error checking username" });
    }
};

// --------------------------
// UPDATE PROFILE
// --------------------------
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, location, timezone, username, reminderSettings } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (location) user.location = location;
        if (timezone) user.timezone = timezone;

        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(409).json({ message: "Username is already taken" });
            }
            user.username = username;
        }

        await user.save();

        if (req.body.reminderSettings) {
            user.reminderSettings = req.body.reminderSettings;
            // Trigger async regeneration (don't await to keep response fast, or await if critical)
            // Ideally import from reminderController. But circular dependency might exist if reminderController imports User.
            // Best pattern: Move regen logic to a service or just require it lazily.
            const { regenerateReminders } = require('./reminderController');
            await regenerateReminders(user._id);
        }

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                location: user.location,
                timezone: user.timezone,
                reminderSettings: user.reminderSettings
            }
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Server error updating profile" });
    }
};


