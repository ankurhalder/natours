const fs = require('fs');
const express = require('express');
const app = express();

// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello from server Ankur Halder',
//     app: 'Natours',
//   });
// });

// app.post('/', (req, res) => {
//   res.status(200).send('posting!');
// });
const tours = fs.readFileSync(
  `${__dirname}/dev-data/data/tours-simple.json`,
  'utf-8'
);
toursData = JSON.parse(tours);
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: toursData.length,
    data: { toursData },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on the port ${port}`);
});
