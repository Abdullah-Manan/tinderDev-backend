const express = require("express");
const app = express();

// This will only handle GET call
app.get("/user", (req, res) => {
  res.send({ fName: "Abdullah", lname: "Manan" });
});

// This will only handle POST call
app.post("/user", (req, res) => {
  res.send("Data successfully send to database!");
});

// This will only handle DELETE call
app.delete("/user", (req, res) => {
  res.send("Data successfully deleted!");
});

// This will  handle all call
app.use("/test", (req, res) => {
  res.send("Hello from server");
  res.send("Hello from server");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
