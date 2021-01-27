const axios = require("axios");
const catchAsync = require("../utils/catchAsync");

exports.autocompleteLocation = catchAsync(async (req, res, next) => {
  const options = {
    method: "GET",
    url: "https://realtor.p.rapidapi.com/locations/auto-complete",
    params: req.query,
    headers: {
      "x-rapidapi-host": process.env.RAPIDAPI_HOST,
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    },
  };

  const response = await axios.request(options);

  res.status(200).json({
    success: true,
    properties: response.data,
  });
});
