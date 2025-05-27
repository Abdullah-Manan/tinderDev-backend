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
    res.status(201).json({ message: "User", user });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error saving user", details: error.message });
  }
});

app.put("/update-user", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await User.find({ email: userEmail });
    res.status(201).json({ message: "User", user });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error saving user", details: error.message });
  }
});
app.delete("/delete-user", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await User.find({ email: userEmail });
    res.status(201).json({ message: "User", user });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error saving user", details: error.message });
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
