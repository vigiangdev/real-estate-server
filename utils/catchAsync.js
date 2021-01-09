const User = require("../models/User");
const AppError = require("./appError");

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
