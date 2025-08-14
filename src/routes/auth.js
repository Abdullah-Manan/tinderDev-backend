const express = require("express");
const { validationSignUp } = require("../utils/validation");
const authRouter = express.Router();
const User = require("../model/userschema");
const bcrypt = require("bcryptjs");

authRouter.post("/signin", async (req, res) => {
  // 1. Validate the request body
  const { isValid, errors } = validationSignUp(req);

  // 2. If not valid, return errors
  if (!isValid) {
    return res.status(400).json({ errors });
  }
  const { firstName, lastName, email, age, password, gender } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ errors: { email: "Email is already in use." } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      age,
      password: hashedPassword,
      gender,
    });

    await newUser.save();
    res.status(201).json({ message: "User saved successfully", newUser });
  } catch (error) {
    res
      .status(400)
      .json({ ERROR: "Error saving user", details: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email", email);
    console.log("password", password);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isPasswordValid = await user.validatePassword(password);

    // generate token
    if (isPasswordValid) {
      const token = await user.generateAuthToken();
      res.cookie("token", token);
      res
        .status(200)
        .json({ message: "Login successful", user: user, token: token });
      return;
    }
    return res.status(401).json({ error: "Invalid credentials" });
    // add cookies
  } catch (error) {
    res.status(400).json({ error: "Error logging in", details: error.message });
  }
});

authRouter.get("/logout", (req, res) => {
  res.clearCookie("token", null, {
    expires: new Date(),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = { authRouter };
