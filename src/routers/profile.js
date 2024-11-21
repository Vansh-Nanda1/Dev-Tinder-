const express = require("express");
const brcypt = require("bcrypt");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateEditPassword,
} = require("../utils/validation");
const User = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ message: "user data fetched sucessfuly", data: user });
  } catch (error) {
    res.status(400).send("Error:  " + err.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("invalid Edit Request");
    }
    const loggedinUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedinUser[key] = req.body[key];
    });
    await loggedinUser.save();
    res.json({
      message: `${loggedinUser.firstName} Your Profile updated sucessfully`,
      data: loggedinUser,
    });
  } catch (error) {
    res.status(400).send("Error:  " + err.message);
  }
});

profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    if (!validateEditPassword(req)) {
      throw new Error("invalid Edit Request");
    }
    const loggedinUser = req.user;
    const { oldPassword, newPassword } = req.body;
    const isPasswordValid = await loggedinUser.validatePassword(oldPassword);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    } else {
      const passwordHash = await brcypt.hash(newPassword, 10);
      loggedinUser.password = passwordHash;
      loggedinUser.save();
      res.status(200).json({
        message: "Password updated successfully",
        data: loggedinUser,
      });
    }
  } catch (err) {
    res.status(400).send("Error:  " + err.message);
  }
});

module.exports = profileRouter;
