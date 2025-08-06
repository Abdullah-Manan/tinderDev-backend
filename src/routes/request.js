const express = require("express");
const { userAuth } = require("../middleware/auth.js");

const requestRouter = express.Router();

// POST /sendConnectionRequest
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      message: "Connection request sent (placeholder)",
      from: user.firstName + " " + user.lastName,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to send connection request",
      details: error.message,
    });
  }
});

module.exports = { requestRouter };
