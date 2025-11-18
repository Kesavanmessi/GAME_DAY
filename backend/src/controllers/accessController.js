const AccessRequest = require("../models/AccessRequest");
const User = require("../models/User");

exports.requestPrivateAccess = async (req, res) => {
  const requesterId = req.user._id;
  const { friendId } = req.body;

  // Prevent duplicate requests
  const existing = await AccessRequest.findOne({
    requesterId,
    ownerId: friendId,
  });

  if (existing) {
    return res.json({ message: "Request already sent", status: existing.status });
  }

  const newReq = new AccessRequest({
    requesterId,
    ownerId: friendId,
  });

  await newReq.save();
  res.json({ message: "Access request sent", status: "pending" });
};

exports.checkAccessStatus = async (req, res) => {
  const requesterId = req.user._id;
  const ownerId = req.params.friendId;

  const request = await AccessRequest.findOne({ requesterId, ownerId });

  if (!request) return res.json({ status: "none" });

  res.json({ status: request.status });
};

exports.handleAccessRequest = async (req, res) => {
  const ownerId = req.user._id;
  const { requestId, action } = req.body; // "approve" or "reject"

  const request = await AccessRequest.findOne({ _id: requestId, ownerId });

  if (!request) return res.status(404).json({ message: "Request not found" });

  request.status = action === "approve" ? "approved" : "rejected";
  await request.save();

  res.json({ message: `Request ${request.status}` });
};

exports.getMyAccessRequests = async (req, res) => {
  const ownerId = req.user._id;

  const requests = await AccessRequest.find({ ownerId, status: "pending" })
    .populate("requesterId", "name email");

  res.json({ requests });
};
