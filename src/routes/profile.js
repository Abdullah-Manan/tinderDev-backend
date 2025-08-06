const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ message: "Profile fetched successfully", user });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error fetching user", details: error.message });
  }
});

module.exports = { profileRouter };
