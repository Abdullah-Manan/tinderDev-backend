const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/devtinder"
    );

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Not Connected");
  }
};

module.exports = connectDB;
