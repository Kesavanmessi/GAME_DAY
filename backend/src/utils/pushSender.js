const admin = require("./firebaseAdmin");
const DeviceToken = require("../models/DeviceToken");

/**
 * sendPushToUser
 * - userId: ObjectId of recipient
 * - title, body: notification text
 * - data: optional object
 */
async function sendPushToUser(userId, title, body, data = {}) {
  try {
    const tokens = await DeviceToken.find({ userId });
    if (!tokens || tokens.length === 0) return { ok: false, reason: "no tokens" };

    const registrationTokens = tokens.map(t => t.token);

    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      tokens: registrationTokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    // Optionally remove invalid tokens
    const failed = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        failed.push(registrationTokens[idx]);
      }
    });
    if (failed.length) {
      await DeviceToken.deleteMany({ token: { $in: failed } });
    }
    return { ok: true, response, failed };
  } catch (err) {
    console.error("Push send error:", err);
    return { ok: false, error: err };
  }
}

module.exports = { sendPushToUser };
