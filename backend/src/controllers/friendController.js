const User = require("../models/User");

// ----------------------------
// SEND FRIEND REQUEST
// ----------------------------
exports.sendFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendEmail } = req.body;

    const friend = await User.findOne({ email: friendEmail });

    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    if (friend._id.equals(userId)) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    // Check if already friends or pending
    const alreadyExists = friend.friends.find(f => f.friendId.equals(userId));
    if (alreadyExists) {
      return res.status(400).json({ message: "Friend request already sent or user already added" });
    }

    // Add request to the friend's list
    friend.friends.push({
      friendId: userId,
      status: "pending",
    });

    await friend.save();

    res.json({ message: "Friend request sent successfully" });

  } catch (error) {
    console.error("Friend Request Error:", error);
    res.status(500).json({ message: "Server error sending friend request" });
  }
};

// ----------------------------
// ACCEPT FRIEND REQUEST
// ----------------------------
exports.acceptFriendRequest = async (req, res) => {
  try {
    const user = req.user;
    const { requesterId } = req.body;

    // update current user — set friend's status to "accepted"
    const request = user.friends.find(f => f.friendId.equals(requesterId));

    if (!request) {
      return res.status(404).json({ message: "No friend request from this user" });
    }

    request.status = "accepted";
    await user.save();

    // Also update requester - add current user to their friend list
    const requester = await User.findById(requesterId);

    requester.friends.push({
      friendId: user._id,
      status: "accepted",
    });

    await requester.save();

    res.json({ message: "Friend request accepted" });

  } catch (error) {
    console.error("Accept Friend Error:", error);
    res.status(500).json({ message: "Server error accepting friend request" });
  }
};

// ----------------------------
// GET FRIENDS LIST
// ----------------------------
exports.getFriendsList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friends.friendId", "name email");

    const accepted = user.friends.filter(f => f.status === "accepted");

    res.json(accepted);

  } catch (error) {
    console.error("Friends List Error:", error);
    res.status(500).json({ message: "Failed to fetch friends list" });
  }
};

// ----------------------------
// GET FRIEND'S PUBLIC FAVORITES
// ----------------------------
exports.getFriendPublicFavorites = async (req, res) => {
  try {
    const { friendId } = req.params;

    const friend = await User.findById(friendId);

    if (!friend) return res.status(404).json({ message: "Friend not found" });

    res.json({
      publicFavorites: friend.publicFavorites,
      veryFavoriteTeams: friend.veryFavoriteTeams,
    });

  } catch (error) {
    console.error("Friend Favorites Error:", error);
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};
