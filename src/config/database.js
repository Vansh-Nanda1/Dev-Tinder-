const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://vanshnanda0001:NodeSeason2@testnode.if4mc.mongodb.net/devTinder?retryWrites=true&w=majority"
  );
};

module.exports = connectDB
