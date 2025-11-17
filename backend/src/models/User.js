const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    location: {
      type: String,
      default: null,
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    // Teams visibility settings
    publicFavorites: [
      {
        teamId: Number,
        leagueId: String,
      },
    ],

    privateFavorites: [
      {
        teamId: Number,
        leagueId: String,
      },
    ],

    veryFavoriteTeams: [
      {
        teamId: Number,
        leagueId: String,
      },
    ],

    friends: [
      {
        friendId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["pending", "accepted"],
          default: "pending",
        },
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
