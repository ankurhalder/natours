/* eslint-disable no-console */
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Tour = require("../../models/tourModel");

dotenv.config({
  path: "../../config.env",
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.MONGO_PASSWORD,
);

mongoose
  .connect(DB, {})
  .then(() => {
    console.log("DB Connection Successful!");
  })
  .catch((err) => {
    console.error("DB Connection Error:", err);
    process.exit(1);
  });

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"),
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data Successfully Loaded!");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// DELETE ALL DATA FROM DATABASE
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data Successfully Deleted!");
    await importData();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Check command-line arguments
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
} else {
  console.log("Please provide a valid command: --import or --delete");
  process.exit(1);
}
