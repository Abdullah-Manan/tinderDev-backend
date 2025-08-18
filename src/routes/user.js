// routes/user.routes.js
const express = require("express");
const mongoose = require("mongoose");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../model/connectionRequest");

const userRouter = express.Router();

const allowData = ["firstName", "lastName", "email", "photoUrl"];

// get all the connection requests received by the logged in user
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
    }).populate("fromUserId", allowData);

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

// get all the connections of the logged in user
// this will return all the users that the logged in user is connected to
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found in request context.",
      });
    }

    const loggedInUserId = req.user._id;

    const acceptedConnections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
      status: "accepted",
    }).populate([
      {
        path: "fromUserId",
        select: allowData,
      },
      {
        path: "toUserId",
        select: allowData,
      },
    ]);

    const connectedUsers = acceptedConnections.map((connection) => {
      if (connection.fromUserId._id.toString() === loggedInUserId.toString()) {
        return connection.toUserId;
      } else {
        return connection.fromUserId;
      }
    });

    return res.json({
      success: true,
      message: "Connections fetched successfully.",
      data: connectedUsers,
    });
  } catch (error) {
    console.error("Error fetching connections:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch connections.",
    });
  }
});

module.exports = { userRouter };
