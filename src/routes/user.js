// routes/user.routes.js
const express = require("express");
const mongoose = require("mongoose");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../model/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found in request context.",
      });
    }

    const loggedInUserId = req.user._id;

    const toId = new mongoose.Types.ObjectId(loggedInUserId);

    const connectionRequests = await ConnectionRequest.find({
      toUserId: toId,
      status: "interested",
    }).populate("fromUserId", "firstName lastName email photoUrl");

    return res.json({
      success: true,
      message: "Connection requests fetched successfully.",
      data: connectionRequests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch connection requests.",
    });
  }
});

module.exports = { userRouter };
