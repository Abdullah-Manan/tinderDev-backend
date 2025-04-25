const auth = (req, res, next) => {
  const token = "xyz";

  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }
    // Here you would typically verify the token
    // For now, we'll just check if it exists
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "Token verification failed, authorization denied" });
  }
};

const auth2 = (req, res, next) => {
  const token = "";

  try {
    if (!token) {
      next();
    }

    return res
      .status(401)
      .json({ message: "No authentication token, access denied" });
  } catch (err) {
    res
      .status(401)
      .json({ message: "Token verification failed, authorization denied" });
  }
};
module.exports = { auth, auth2 };
