const { mongoose } = require("../db");


const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    type: {
      type: String,
      enum: ["friend_request", "friend_accept", "access_request", "access_approved", "access_rejected", "reminder"],
      required: true,
    },

    message: { type: String, required: true },

    isRead: { type: Boolean, default: false },

    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
