const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isAlpha(v, "en-US", { ignore: " " }),
        message: "First name must contain only letters.",
      },
    },
    lastName: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isAlpha(v, "en-US", { ignore: " " }),
        message: "Last name must contain only letters.",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address.",
      },
    },
    age: {
      type: Number,
      required: true,
      min: [0, "Age must be a positive number."],
      validate: {
        validator: Number.isInteger,
        message: "Age must be an integer.",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters."],
      validate: {
        validator: (v) =>
          validator.isStrongPassword(v, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 0,
            minNumbers: 1,
            minSymbols: 0,
          }),
        message:
          "Password must be at least 6 characters and contain at least one number.",
      },
    },
    gender: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
