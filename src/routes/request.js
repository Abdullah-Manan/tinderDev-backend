const express = require("express");
const { userAuth } = require("../middleware/auth.js");
const User = require("../model/userschema.js");
const ConnectionRequest = require("../model/connectionRequest.js");

const requestRouter = express.Router();

// POST /sendConnectionRequest
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const statusInclude = ["intrested", "ignored"];
      if (!statusInclude.includes(status)) {
        return res.status(404).json({
          message: "Invalid request status",
        });
      }
      const sendRequest = new ConnectionRequest();
    } catch (error) {
      res.status(500).json({
        error: "Failed to send connection request",
        details: error.message,
      });
    }
  }
);

module.exports = { requestRouter };
