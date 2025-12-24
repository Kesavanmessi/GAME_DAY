const Notification = require("../models/Notification");

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ notifications });
  } catch (error) {
    console.error("Get Notifications Error:", error);
    res.status(500).json({ message: "Server error fetching notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { isRead: true }
    );

    res.json({ message: "Marked as read" });
  } catch (error) {
    console.error("Mark Read Error:", error);
    res.status(500).json({ message: "Server error marking notification as read" });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id },
      { isRead: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark All Read Error:", error);
    res.status(500).json({ message: "Server error marking all notifications as read" });
  }
};
