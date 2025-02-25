const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello Mr. Abdullah Manan");
});

app.get("/abdullah", (req, res) => {
  res.send("Hello Mr. Abdullah Manan");
});

app.get("/hello", (req, res) => {
  res.send("Hello Hello Hello Hello...");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
