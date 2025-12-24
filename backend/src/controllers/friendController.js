const User = require("../models/User");

// ----------------------------
// SEND FRIEND REQUEST
// ----------------------------
exports.sendFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendEmail, email } = req.body; // Frontend might send 'email'
    const targetEmail = friendEmail || email;

    const friend = await User.findOne({ email: targetEmail });

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
// ACCEPT/REJECT FRIEND REQUEST
// ----------------------------
exports.handleFriendRequest = async (req, res) => {
  try {
    const user = req.user;
    const { requestId, action, email } = req.body;
    // Frontend might send 'email' for accept, or 'requestId' (which is actually the friend's ID usually in this simple schema)

    let targetId = requestId;

    // If email is provided, find the user ID
    if (email && !targetId) {
      const targetUser = await User.findOne({ email });
      if (targetUser) targetId = targetUser._id;
    }

    // Find the friend request in user's list
    // In this simple schema, we look for the friendId in the friends array
    const friendEntry = user.friends.find(f => f.friendId.equals(targetId) || f._id.equals(requestId));

    if (!friendEntry) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (action === "reject") {
      // Remove from array
      user.friends = user.friends.filter(f => f !== friendEntry);
      await user.save();
      return res.json({ message: "Friend request rejected" });
    }

    // Accept
    friendEntry.status = "accepted";
    await user.save();

    // Also update requester - add current user to their friend list
    const requester = await User.findById(friendEntry.friendId);
    if (requester) {
      const existing = requester.friends.find(f => f.friendId.equals(user._id));
      if (!existing) {
        requester.friends.push({
          friendId: user._id,
          status: "accepted",
        });
      } else {
        existing.status = "accepted";
      }
      await requester.save();
    }

    res.json({ message: "Friend request accepted" });

  } catch (error) {
    console.error("Handle Friend Request Error:", error);
    res.status(500).json({ message: "Server error handling friend request" });
  }
};

// ----------------------------
// GET FRIENDS LIST
// ----------------------------
exports.getFriendsList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friends.friendId", "name email location");

    const accepted = user.friends.filter(f => f.status === "accepted");

    // Format for frontend
    const formatted = accepted.map(f => ({
      _id: f.friendId._id,
      name: f.friendId.name,
      email: f.friendId.email,
      location: f.friendId.location
    }));

    res.json(formatted);

  } catch (error) {
    console.error("Friends List Error:", error);
    res.status(500).json({ message: "Failed to fetch friends list" });
  }
};

// ----------------------------
// GET PENDING REQUESTS
// ----------------------------
exports.getPendingRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friends.friendId", "name email");

    const pending = user.friends.filter(f => f.status === "pending");

    const formatted = pending.map(f => ({
      _id: f.friendId._id, // Use user ID as request ID for simplicity in this flow
      name: f.friendId.name,
      email: f.friendId.email
    }));

    res.json(formatted);

  } catch (error) {
    console.error("Pending Requests Error:", error);
    res.status(500).json({ message: "Failed to fetch pending requests" });
  }
};

// ----------------------------
// GET FRIEND PROFILE
// ----------------------------
exports.getFriendProfile = async (req, res) => {
  try {
    const { friendId } = req.params;
    const friend = await User.findById(friendId).select("name email location publicFavorites veryFavoriteTeams");

    if (!friend) return res.status(404).json({ message: "Friend not found" });

    res.json(friend);
  } catch (error) {
    console.error("Friend Profile Error:", error);
    res.status(500).json({ message: "Failed to fetch friend profile" });
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
