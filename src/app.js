const express = require("express");
const { auth, auth2 } = require("./middleware/auth.js");
const app = express();

app.use("/user", auth);

app.get("/user", (req, res) => {
  res.send("1st User Detail");
});

app.get("/user2", auth2, (req, res) => {
  res.send("2nd User Detail");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
