const express = require("express");
const app = express();

app.use(
  "/user",
  (req, res) => {
    res.send("1st User Detail");
  },
  (req, res) => {
    res.send("2nd User Detail");
  },
  (req, res) => {
    res.send("2nd User Detail");
  }
);

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
