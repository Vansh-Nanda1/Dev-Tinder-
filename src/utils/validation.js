const validator = require("validator");

//? you can skip this validation we have already validate in schema
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("please enter both firstName and lastName");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("FirstName should be 4-50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not Valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("PLease enter a strong Password from !");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "gender",
    "about",
    "skills",
    "photoUrl",
    "emailId",
    "age",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

const validateEditPassword = (req) => {
  const allowedEditFields = ["oldPassword", "newPassword"];
  const isPasswordAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isPasswordAllowed;
};
module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateEditPassword,
};
