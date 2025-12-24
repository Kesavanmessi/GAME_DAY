const { mongoose } = require("../db");


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

    googleId: {
      type: String,
      unique: true,
      sparse: true
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      minlength: 5
    },

    picture: {
      type: String
    },

    location: {
      type: String,
      default: null,
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    reminderSettings: {
      enabled: { type: Boolean, default: true },
      slots: [
        {
          id: { type: Number, default: 1 },
          minutesBefore: { type: Number, default: 60 },
          deliveryMethod: { type: String, enum: ['email', 'push'], default: 'email' },
          enabled: { type: Boolean, default: true }
        },
        {
          id: { type: Number, default: 2 },
          minutesBefore: { type: Number, default: 30 },
          deliveryMethod: { type: String, enum: ['email', 'push'], default: 'push' },
          enabled: { type: Boolean, default: false }
        },
        {
          id: { type: Number, default: 3 },
          minutesBefore: { type: Number, default: 15 },
          deliveryMethod: { type: String, enum: ['email', 'push'], default: 'push' },
          enabled: { type: Boolean, default: false }
        }
      ]
    },

    // Teams visibility settings
    publicFavorites: [
      {
        teamId: Number,
        leagueId: String,
        reminderSettings: {
          enabled: { type: Boolean, default: null }, // null = inherit global? Or just undefined. Let's use strict object if set.
          slots: [
            {
              id: { type: Number },
              minutesBefore: { type: Number },
              deliveryMethod: { type: String, enum: ['email', 'push'] },
              enabled: { type: Boolean }
            }
          ]
        }
      },
    ],

    privateFavorites: [
      {
        teamId: Number,
        leagueId: String,
        reminderSettings: {
          enabled: { type: Boolean, default: null },
          slots: [{
            id: Number, minutesBefore: Number, deliveryMethod: String, enabled: Boolean
          }]
        }
      },
    ],

    veryFavoriteTeams: [
      {
        teamId: Number,
        leagueId: String,
        reminderSettings: {
          enabled: { type: Boolean, default: null },
          slots: [{
            id: Number, minutesBefore: Number, deliveryMethod: String, enabled: Boolean
          }]
        }
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
    privateAccessRequests: [
      {
        requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ["pending", "accepted"], default: "pending" }
      }
    ],

    approvedPrivateViewers: [
      {
        viewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
      }
    ],

  },

  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
