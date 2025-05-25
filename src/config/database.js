const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://abdullah:J5D52Pe7_X-35ds@learnnode.ygpwk.mongodb.net/devTinder "
  );
};

module.exports = connectDB;
