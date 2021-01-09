const express = require("express");
const passport = require("passport");

const favoriteController = require("../controllers/favoriteController");
const router = express.Router();

router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    favoriteController.getFavorites
  )
  .post(
    passport.authenticate("jwt", { session: false }),
    favoriteController.addFavorite
  )
  .delete(
    passport.authenticate("jwt", { session: false }),
    favoriteController.deleteFavorite
  );

module.exports = router;
