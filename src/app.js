const express = require("express");
require("./config/database.js");
const { auth, auth2 } = require("./middleware/auth.js");
const { auth, auth2 } = require("./middleware/auth.js");
const app = express();

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
