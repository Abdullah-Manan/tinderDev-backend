const jwt = require("jsonwebtoken");
const User = require("../model/userschema");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }
    const isTokenValid = jwt.verify(token, "secret");
    if (!isTokenValid) {
      return res
        .status(401)
        .json({ message: "Invalid authentication token, access denied" });
    }
    const { _id } = isTokenValid;
    const user = await User.findById({ _id });
    if (!user) {
      return res.status(401).json({ message: "User not found, access denied" });
    }
    req.user = user;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "Token verification failed, authorization denied" });
  }
};
module.exports = { userAuth };
