const express = require("express");
const { userAuth } = require("../middleware/auth.js");
const User = require("../model/userschema.js");

const requestRouter = express.Router();

// POST /sendConnectionRequest
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { targetUserId } = req.body;
    if (!targetUserId) {
      return res.status(400).json({ error: "targetUserId is required" });
    }
    if (user._id.equals(targetUserId)) {
      return res
        .status(400)
        .json({ error: "You cannot send a connection request to yourself." });
    }
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: "Target user not found" });
    }
    // Prevent duplicate requests
    if (
      targetUser.pendingRequests &&
      targetUser.pendingRequests.includes(user._id)
    ) {
      return res.status(409).json({ error: "Connection request already sent" });
    }
    // Add the request
    targetUser.pendingRequests = targetUser.pendingRequests || [];
    targetUser.pendingRequests.push(user._id);
    await targetUser.save();
    res.status(200).json({
      message: "Connection request sent successfully",
      from: user._id,
      to: targetUserId,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to send connection request",
      details: error.message,
    });
  }
});

module.exports = { requestRouter };
