const fs = require("fs");
const tours = fs.readFileSync(
  `${__dirname}/../dev-data/data/tours-simple.json`,
  "utf-8"
);
const toursData = JSON.parse(tours);
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    requetedAt: req.requestTime,
    results: toursData.length,
    data: { toursData },
  });
};

exports.getTour = (req, res) => {
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

exports.createTour = (req, res) => {
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
exports.updateTour = (req, res) => {
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

exports.deleteTour = (req, res) => {
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
