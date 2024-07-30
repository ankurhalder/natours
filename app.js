const express = require("express");
const morgan = require("morgan");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// @ 1) Global  middlewares
//# Security HTTP headers
app.use(helmet());
//# dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//# Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  // # Try to use JSON is response in future
  message: "Too many requests from this IP, plaese try again in an hour!",
});

app.use("/api", limiter);

//# Body parser, reading data from the body
app.use(
  express.json({
    limit: "15kb",
  }),
);
//# Data sanitization against NOSQL query injection
app.use(mongoSanitize());
//# Data sanitization agaianst XSS
app.use(xss());
//# Serving static files
app.use(express.static(path.join(__dirname, "public")));

//# Test Middleware
app.use((req, res, next) => {
  // console.log("hello from middleware 😊");
  next();
});

//@ 2) Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
