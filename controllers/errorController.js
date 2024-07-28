const AppError = require("../utils/appError");

// ! below all DB handlers need to change according to needs
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateDB = (err) => {
  const message = `Duplicate field value '${err.errors.name.value}'.please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid Token. PLease Log in again", 404);

const handleJWTExpiresError = () =>
  new AppError("Your Token has expired. please log in again!", 404);
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //# Operational trusted error: Send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //# Programming or other unknown error: dont leak error details
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // ! below all codes need to change according to needs
    let error = { ...err, name: err.name };
    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (error._message === "Tour validation failed") {
      error = handleDuplicateDB(error);
    }
    if (error.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }
    if (error.name === "JsonWebTokenError") {
      error = handleJWTError(error);
    }
    if (error.name === "TokenExpiredError")
      error = handleJWTExpiresError(error);
    sendErrorProd(error, res);
  }
};
