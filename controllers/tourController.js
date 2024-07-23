const fs = require("fs");

const tours = fs.readFileSync(
  `${__dirname}/../dev-data/data/tours-simple.json`,
  "utf-8",
);

exports.checkID = (req, res, next, val) => {
  const toursData = JSON.parse(tours);
  if (req.params.id * 1 > toursData.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "Missing name or Price",
    });
  }
  next();
};

const toursData = JSON.parse(tours);
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: toursData.length,
    data: { toursData },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = toursData.find((el) => el.id === id);
  res.status(200).json({
    status: "success",
    data: { tour },
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body);
  const newId = toursData[toursData.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  toursData.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(toursData, null, 2),
    () => {
      res.status(201).json({
        status: "success",
        results: toursData.length,
        data: { tour: newTour },
      });
    },
  );
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "Updated Tours Here",
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
