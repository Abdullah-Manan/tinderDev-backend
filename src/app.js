require("dotenv").config();
const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/database.js");
const { cron } = require("./utils/cronjobs.js");
const initializeSocket = require("./utils/socket.js");
const app = express();
const server = http.createServer(app);
initializeSocket(server);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const { authRouter } = require("./routes/auth.js");
const { profileRouter } = require("./routes/profile.js");
const { requestRouter } = require("./routes/request.js");
const { userRouter } = require("./routes/user.js");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Datbase is connected");
    server.listen(process.env.PORT, () => {
      console.log(
        "Server is successfully listening on port " + process.env.PORT
      );
    });
  })
  .catch(() => {
    console.log("Datbase is not connected");
  });
