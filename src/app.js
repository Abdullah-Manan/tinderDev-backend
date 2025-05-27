const express = require("express");
const connectDB = require("./config/database.js"); // Get the function
const app = express();
const User = require("./model/userschema");
app.use(express.json());

app.post("/signin", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "User saved successfully", user });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error saving user", details: error.message });
  }
});

app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await User.find({ email: userEmail });
    if (user.length === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(201).json({ message: "User", user });
    }
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error saving user", details: error.message });
  }
});

app.patch("/update-user", async (req, res) => {
  try {
    const { userId, firstName, lastName, email, age, password, gender } =
      req.body;
    // Check if the new email is already used by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res
          .status(409)
          .json({ error: "Email already in use by another user." });
      }
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { firstName, lastName, email, age, password, gender },
      { returnDocument: "after" }
    );
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
    } else {
      res
        .status(200)
        .json({ message: "Updated successfully", user: updatedUser });
    }
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error updating user", details: error.message });
  }
});

app.delete("/delete-user", async (req, res) => {
  try {
    const { userId, email } = req.body;
    let deletedUser;
    if (userId) {
      deletedUser = await User.findByIdAndDelete(userId);
    } else if (email) {
      deletedUser = await User.findOneAndDelete({ email });
    } else {
      return res
        .status(400)
        .json({ error: "Please provide userId or email to delete a user." });
    }
    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
    } else {
      res
        .status(200)
        .json({ message: "User deleted successfully", user: deletedUser });
    }
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error deleting user", details: error.message });
  }
});

connectDB()
  .then(() => {
    console.log("Datbase is connected");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000");
    });
  })
  .catch(() => {
    console.log("Datbase is not connected");
  });
