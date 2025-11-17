const User = require("../models/User");

// -------------------------------------
// REQUEST ACCESS TO PRIVATE FAVORITES
// -------------------------------------
exports.requestPrivateAccess = async (req, res) => {
  try {
    const requester = req.user;
    const { friendId } = req.body;

    if (friendId === requester._id.toString()) {
      return res.status(400).json({ message: "You cannot request yourself" });
    }

    const friend = await User.findById(friendId);

    if (!friend) return res.status(404).json({ message: "Friend not found" });

    // Check if already approved
    const alreadyApproved = friend.approvedPrivateViewers.some(
      (v) => v.viewerId.toString() === requester._id.toString()
    );

    if (alreadyApproved) {
      return res.json({ message: "You already have access" });
    }

    // Check if already requested
    const exists = friend.privateAccessRequests.some(
      (reqObj) => reqObj.requesterId.toString() === requester._id.toString()
    );

    if (exists) {
      return res.status(400).json({ message: "Request already sent" });
    }

    // Add new request
    friend.privateAccessRequests.push({
      requesterId: requester._id,
      status: "pending",
    });

    await friend.save();

    res.json({ message: "Private access request sent" });

  } catch (error) {
    console.error("Private Access Request Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------------
// ACCEPT PRIVATE ACCESS REQUEST
// -------------------------------------
exports.acceptPrivateAccess = async (req, res) => {
  try {
    const user = req.user;
    const { requesterId } = req.body;

    const request = user.privateAccessRequests.find(
      (r) => r.requesterId.toString() === requesterId
    );

    if (!request) {
      return res.status(404).json({ message: "No such access request" });
    }

    request.status = "accepted";

    // Add to approved viewers
    user.approvedPrivateViewers.push({ viewerId: requesterId });

    await user.save();

    res.json({ message: "Private access granted" });

  } catch (error) {
    console.error("Private Access Accept Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------------
// VIEW PRIVATE FAVORITES OF FRIEND
// -------------------------------------
exports.getFriendPrivateFavorites = async (req, res) => {
  try {
    const viewer = req.user;
    const { friendId } = req.params;

    const friend = await User.findById(friendId);

    if (!friend) return res.status(404).json({ message: "Friend not found" });

    // Check if viewer has access
    const allowed = friend.approvedPrivateViewers.some(
      (v) => v.viewerId.toString() === viewer._id.toString()
    );

    if (!allowed) {
      return res.status(403).json({ message: "You do not have access" });
    }

    res.json(friend.privateFavorites);

  } catch (error) {
    console.error("Private Favorite View Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
