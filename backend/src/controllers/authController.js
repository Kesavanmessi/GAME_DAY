const User = require("../models/User");
const generateToken = require("../utils/jwt");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --------------------------
// GOOGLE LOGIN CONTROLLER
// --------------------------
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Find or Create User
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        picture,
        location: null,
        timezone: "Asia/Kolkata",
      });
    } else {
      // Update existing user info if needed
      if (!user.googleId) user.googleId = googleId;
      if (!user.picture) user.picture = picture;
      await user.save();
    }

    const jwtToken = generateToken(user._id);

    res.json({
      message: "Login successful",
      token: jwtToken,
      requiresUsername: !user.username,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        picture: user.picture,
        location: user.location,
        timezone: user.timezone,
        publicFavorites: user.publicFavorites,
        privateFavorites: user.privateFavorites,
        veryFavoriteTeams: user.veryFavoriteTeams,
        friends: user.friends,
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ message: "Server error during Google login" });
  }
};
