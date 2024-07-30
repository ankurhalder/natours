const express = require("express");
const morgan = require("morgan");
const path = require("path");
const rateLimit = require("express-rate-limit");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

//@ Global  middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  // # Try to use JSON is response in future
  message: "Too many requests from this IP, plaese try again in an hour!",
});

app.use("/api", limiter);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // console.log("hello from middleware 😊");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
