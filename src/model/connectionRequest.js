const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    formUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "inrested", "rejected", "accepted"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
