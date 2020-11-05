const bcrypt = require("bcrypt");
const Auth = require("../../models/user/auth");
const Error = require("../../utils/errors");

// FOR TESTING ONLY
exports.test = (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "This route is only for testing purpose.",
  });
};

// Auth Sign In Route
exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await Auth.findOne({ email });
  if (user) {
    bcrypt.compare(password, user.hashedPassword, function (err, result) {
      // console.log(result);
      if (result) {
        res.status(200).json({
          success: "Success",
          isAuthSignedIn: true,
          message: "Sign in successful.",
          data: user,
        });
      } else {
        res.status(400).json({
          success: "Fail",
          message: Error.errorMessages.signinFailed,
        });
      }
    });
  } else {
    res.status(400).json({
      success: "Fail",
      message: Error.errorMessages.signinFailed,
    });
  }
};

// Auth Sign In Route
exports.signUp = async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Search if the contact already exists
  const isAlreadyRegistered = await Auth.findOne({ email });

  // 2. If not exists
  if (!isAlreadyRegistered) {
    bcrypt.hash(password, 10, function (err, hash) {
      // Store hash in your password DB.
      const newAuth = Auth({
        name,
        email,
        hashedPassword: hash,
      });

      newAuth
        .save()
        .then((data) =>
          res.status(200).json({
            status: "Success",
            data,
            message: "Signup successful",
          })
        )
        .catch((err) => console.log(err));
    });
  } else {
    res.status(400).json({
      status: "Fail",
      message: Error.errorMessages.contactAlreadyExists,
    });
  }
};
