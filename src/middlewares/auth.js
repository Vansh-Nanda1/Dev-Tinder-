const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    // read the token from the req cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Please login first");
    }
    // validate the token
    const decodedToken = await jwt.verify(token, "DevTinder@123$790");
    const { _id } = decodedToken;
    // find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    //? whatever user i have found attach to req
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};
module.exports = { userAuth };
