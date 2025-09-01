const express = require("express");
const { userAuth } = require("../middleware/auth.js");
const User = require("../model/userschema.js");
const ConnectionRequest = require("../model/connectionRequest.js");
const mongoose = require("mongoose");
const requestRouter = express.Router();
const sendEmail = require("../utils/sendEmail.js");

// ... existing code ...

// POST /sendConnectionRequest
// requestRouter.post(
//   "/request/send/:status/:toUserId",
//   userAuth,
//   async (req, res) => {
//     try {
//       const fromUserId = req.user._id;
//       const toUserId = req.params.toUserId;
//       const status = req.params.status;

//       const statusInclude = ["intrested", "ignored"];
//       if (!statusInclude.includes(status)) {
//         return res.status(404).json({
//           message: "Invalid request status",
//         });
//       }
//       const sendRequest = new ConnectionRequest();
//     } catch (error) {
//       res.status(500).json({
//         error: "Failed to send connection request",
//         details: error.message,
//       });
//     }
//   }
// );

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const VALID_STATUSES = ["interested", "ignored"];

      // Basic input guards
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ message: "Invalid request status" });
      }
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({ message: "Invalid toUserId" });
      }

      // Self request short-circuit (also enforced by schema pre-save)
      if (fromUserId.toString() === toUserId.toString()) {
        return res
          .status(400)
          .json({ message: "You can't send a request to yourself" });
      }

      // Bidirectional duplicate check via $or: (A→B) or (B→A)
      const existing = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existing) {
        return res.status(409).json({
          message: "Connection request already exists",
          requestId: existing._id,
          status: existing.status,
        });
      }

      // Create and save
      const sendRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const saved = await sendRequest.save();
      const emailResponse = await sendEmail.run(
        status,
        "A new " +
          status +
          " connection request from " +
          req.user.firstName +
          " " +
          req.user.lastName
      );
      console.log(emailResponse);

      return res.status(201).json({
        message: "Connection request sent",
        data: saved,
      });
    } catch (error) {
      // Handle schema validation errors cleanly
      return res.status(500).json({
        error: "Failed to send connection request",
        details: error.message,
      });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const { requestId, status } = req.params;

      const VALID_STATUSES = ["accepted", "rejected"];

      // Basic input guards
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ message: "Invalid request status" });
      }
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ message: "Invalid requestId" });
      }

      // Bidirectional duplicate check via $or: (A→B) or (B→A)
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(409).json({
          message: "No Connection request available",
          requestId: existing._id,
          status: existing.status,
        });
      }

      connectionRequest.status = status;

      const saved = await connectionRequest.save();

      return res.status(201).json({
        message: "Connection request " + status,
        data: saved,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to send connection request",
        details: error.message,
      });
    }
  }
);

module.exports = { requestRouter };
