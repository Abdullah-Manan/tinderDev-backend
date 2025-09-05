const socket = require("socket.io");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../model/userschema");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

// Socket authentication middleware
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication token required"));
    }

    const decoded = jwt.verify(token, "secret");
    const user = await User.findById(decoded._id);

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Authentication failed"));
  }
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000"],
      credentials: true,
    },
  });

  // Apply authentication middleware
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log(
      `User ${socket.user.firstName} ${socket.user.lastName} connected`
    );

    socket.on("joinChat", ({ targetUserId }) => {
      try {
        const room = getSecretRoomId(socket.user._id.toString(), targetUserId);
        socket.join(room);

        console.log(`User ${socket.user.firstName} joined chat room: ${room}`);

        // Notify the room that user joined
        socket.to(room).emit("userJoined", {
          firstName: socket.user.firstName,
          lastName: socket.user.lastName,
          userId: socket.user._id,
        });
      } catch (error) {
        console.error("Error joining chat:", error);
        socket.emit("error", { message: "Failed to join chat" });
      }
    });

    socket.on("sendMessage", ({ targetUserId, text }) => {
      try {
        const room = getSecretRoomId(socket.user._id.toString(), targetUserId);
        const messageData = {
          text,
          sender: {
            firstName: socket.user.firstName,
            lastName: socket.user.lastName,
            userId: socket.user._id,
          },
          timestamp: new Date(),
          room,
        };

        console.log("Message sent:", messageData);

        io.to(room).emit("newMessageReceived", { messageData });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(
        `User ${socket.user.firstName} ${socket.user.lastName} disconnected`
      );
    });

    // Handle authentication errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
      socket.emit("error", { message: "Socket error occurred" });
    });
  });
};

module.exports = initializeSocket;
