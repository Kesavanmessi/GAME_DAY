const DeviceToken = require("../models/DeviceToken");

exports.registerToken = async (req, res) => {
  try {
    const userId = req.user._id;
    const { token, platform = "web" } = req.body;
    if (!token) return res.status(400).json({ message: "Token required" });

    const doc = await DeviceToken.findOneAndUpdate(
      { token },
      { userId, platform, lastSeen: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ message: "Token registered", token: doc });
  } catch (err) {
    console.error("Device register error:", err);
    res.status(500).json({ message: "Failed to register token" });
  }
};

exports.unregisterToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token required" });
    await DeviceToken.deleteOne({ token });
    res.json({ message: "Token removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to unregister token" });
  }
};
