const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require("../model/userschema");
const { profileEditValidation } = require("../utils/validation");

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

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    const { isValid, errors } = profileEditValidation(req);
    if (!isValid) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }
    const userId = req.user._id;
    const updateFields = {};
    const allowedFields = [
      "firstName",
      "lastName",
      "email",
      "age",
      "gender",
      "photoUrl",
      "skills",
      "about",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });
    // Prevent email change to an existing email
    if (updateFields.email) {
      const existingUser = await User.findOne({
        email: updateFields.email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res
          .status(409)
          .json({ error: "Email already in use by another user." });
      }
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error updating profile", details: error.message });
  }
});

module.exports = { profileRouter };
