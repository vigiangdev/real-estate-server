const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

/**
 * @type POST
 * @route /api/v1/users/profile
 * @desc return the user's data
 * @access PRIVATE
 */

exports.getUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});
