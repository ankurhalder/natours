const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  console.log("hello from middleware 😊");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Route Handlers
const tours = fs.readFileSync(
  `${__dirname}/dev-data/data/tours-simple.json`,
  "utf-8"
);
const toursData = JSON.parse(tours);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requetedAt: req.requestTime,
    results: toursData.length,
    data: { toursData },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > toursData.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  const tour = toursData.find((el) => el.id === id);
  res.status(200).json({
    status: "success",
    data: { tour },
  });
};

const createTour = (req, res) => {
  console.log(req.body);
  const newId = toursData[toursData.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  toursData.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursData, null, 2),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: "fail",
          message: "Internal Server Error",
        });
      }
      res.status(201).json({
        status: "success",
        results: toursData.length,
        data: { tour: newTour },
      });
    }
  );
};
const updateTour = (req, res) => {
  if (req.params.id * 1 > toursData.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: `Updated Tours Here`,
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > toursData.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    messege: "This route is not yet defined",
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    messege: "This route is not yet defined",
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    messege: "This route is not yet defined",
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    messege: "This route is not yet defined",
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    messege: "This route is not yet defined",
  });
};

// Routes
const tourRouter = express.Router();
const userRouter = express.Router();
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

// Server
const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
