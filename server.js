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

mongoose.connect(DB).then(() => {
  console.log("DB Connection Successful!");
});

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A Tour must have a name"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A Tour must have a price"],
  },
});

const Tour = mongoose.model("Tour", tourSchema);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
