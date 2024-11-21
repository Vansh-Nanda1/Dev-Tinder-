const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 100,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email address" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("enter a strong password ->" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 10,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: `{value} is not correct gender`,
      },
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmejF76y1l-Du-RWE-jcjGEYcNKmrHisH3Sw&s",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid URL address ...->" + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user",
    },
    skills: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 4"],
    },
  },
  { timestamps: true }
);

// Custom validation function for the skills array
function arrayLimit(val) {
  return val.length <= 4;
}

userSchema.methods.getJWT = async function () {
  const user = this; // pointing to that instance of user
  const token = await jwt.sign({ _id: user._id }, "DevTinder@123$790", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};
module.exports = mongoose.model("User", userSchema);
