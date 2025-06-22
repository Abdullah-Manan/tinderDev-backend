const validator = require("validator");

const validationSignUp = (req) => {
  const { firstName, lastName, email, age, password, gender } = req.body;
  const errors = {};

  // firstName: required, only letters
  if (
    !firstName ||
    typeof firstName !== "string" ||
    !validator.isAlpha(firstName, "en-US", { ignore: " " })
  ) {
    errors.firstName = "First name is required and must contain only letters.";
  }

  // lastName: required, only letters
  if (
    !lastName ||
    typeof lastName !== "string" ||
    !validator.isAlpha(lastName, "en-US", { ignore: " " })
  ) {
    errors.lastName = "Last name is required and must contain only letters.";
  }

  // email: required, valid email
  if (!email || typeof email !== "string" || !validator.isEmail(email)) {
    errors.email = "A valid email address is required.";
  }

  // age: required, integer, positive
  if (age === undefined || age === null || !Number.isInteger(age) || age < 0) {
    errors.age = "Age is required and must be a positive integer.";
  }

  // password: required, at least 6 chars, at least one number
  if (
    !password ||
    typeof password !== "string" ||
    !validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
    })
  ) {
    errors.password =
      "Password must be at least 6 characters and contain at least one number.";
  }

  // gender: required
  if (!gender || typeof gender !== "string") {
    errors.gender = "Gender is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
module.exports = { validationSignUp };
