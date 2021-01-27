const express = require("express");

const realtorController = require("../controllers/realtorController");

const router = express.Router();

router.get("/autocomplete", realtorController.autocompleteLocation);

module.exports = router;
