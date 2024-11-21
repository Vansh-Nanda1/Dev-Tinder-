const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const profileRouter = require("./routers/profile")
const authRouter = require("./routers/auth")
const requestRouter = require("./routers/request");
const userRouter = require("./routers/user");


app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(9000, (err) => {
      console.log("sucessfully connected to port 9000");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected!!");
  });
