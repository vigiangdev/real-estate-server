const User = require("../models/User");
const jwt = require("jsonwebtoken");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.header("x-forwarded-proto") === "https",
  });

  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token: `Bearer ${token}`,
    user,
  });
};

/**
 * @type POST
 * @route /api/v1/users/signup
 * @desc signing in user
 * @access PUBLIC
 */
exports.register = catchAsync(async (req, res, next) => {
  let userInfo = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  };

  let user = await User.create(userInfo);

  createSendToken(user, 201, req, res);
});

/**
 * @type POST
 * @route /api/v1/users/login
 * @desc logging in user
 * @access PUBLIC
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Invalid email or password.", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Incorrect email or password.", 401));
  }

  createSendToken(user, 200, req, res);
});
