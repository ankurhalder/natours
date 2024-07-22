const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());

const tours = fs.readFileSync(
  `${__dirname}/dev-data/data/tours-simple.json`,
  'utf-8'
);
const toursData = JSON.parse(tours);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: toursData.length,
    data: { toursData },
  });
});

app.post('/api/v1/tours', (req, res) => {
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
          status: 'fail',
          message: 'Internal Server Error',
        });
      }
      res.status(201).json({
        status: 'success',
        results: toursData.length,
        data: { tour: newTour },
      });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
