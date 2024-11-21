const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoUrl age about gender";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedinUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAVE_DATA);
    if (connectionRequest.length === 0) {
      return res.send("Sorry :No request found for " + loggedinUser.firstName);
    } else {
      res.json({
        messsage: "requets Fetched Successfully",
        data: connectionRequest,
      });
    }
  } catch (err) {
    res.status(404).json("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedinUser._id, status: "accepted" },
        { fromUserId: loggedinUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedinUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      messsage: "Connection Fetched Successfully",
      data: data,
    });
  } catch (err) {
    res.status(404).json("ERROR: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          touserId: loggedinUser._id,
        },
        { fromUserId: loggedinUser._id },
      ],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        {
          _id: { $ne: loggedinUser._id },
        },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.send({ data: users });
  } catch (err) {
    res.status(404).json("ERROR: " + err.message);
  }
});
module.exports = userRouter;
