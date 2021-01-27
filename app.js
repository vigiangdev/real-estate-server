const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet"); // sets http security headers
const xss = require("xss-clean"); // sanitize user input
const hpp = require("hpp"); // protects against http parameter pollution attacks
const mongoSanitize = require("express-mongo-sanitize"); // prevents mongodb operator injection
const rateLimit = require("express-rate-limit"); // limits number of requests from same ip address
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const passport = require("passport");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const userRouter = require("./routes/userRouter");
const favoriteRouter = require("./routes/favoriteRouter");
const realtorRouter = require("./routes/realtorRouter");

const app = express();
require("dotenv").config();
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.enable("trust proxy");
app.disable("x-powered_by");
app.use(cors()); // allow cross origin requests
app.options("*", cors()); // enable CORS pre-flight to allow all domains to perform more complex requests (besides GET, POST, HEAD)
app.use(helmet());
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
require("./config/passport")(passport);
app.use(compression());

// routers
app.use("/api/v1/users", userRouter);
app.use("/api/v1/favorite", favoriteRouter);
app.use("/api/v1/realtor", realtorRouter);

if (process.env.NODE_ENV === "production") {
  // Use static folder
  app.use(express.static(__dirname + "/public"));
  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}

// Catching all incorrect routes
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
