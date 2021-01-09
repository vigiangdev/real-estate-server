const User = require("../models/User");

const catchAsync = require("../utils/catchAsync");
const e = require("express");

exports.getFavorites = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    favoriteListings: user.favoriteListings,
  });
});

exports.addFavorite = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    $push: {
      favoriteListings: req.body.property_id,
    },
  });

  res.status(200).json({
    success: true,
    favoriteListing: req.body.property_id,
  });
});

exports.deleteFavorite = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    $pull: {
      favoriteListings: req.query.property_id,
    },
  });

  res.status(200).json({
    success: true,
  });
});
