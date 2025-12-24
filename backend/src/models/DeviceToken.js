const { mongoose } = require("../db");


const DeviceTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },           // FCM registration token
  platform: { type: String, default: "web" },        // web / android / ios
  lastSeen: { type: Date, default: Date.now }
});

DeviceTokenSchema.index({ userId: 1 });
DeviceTokenSchema.index({ token: 1 }, { unique: true });

module.exports = mongoose.model("DeviceToken", DeviceTokenSchema);
