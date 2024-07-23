/* eslint-disable no-console */
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config.env",
});

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.MONGO_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB Connection Successful!");
  })
  .catch((err) => {
    console.error("DB Connection Error: ", err);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
