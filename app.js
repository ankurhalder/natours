const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello from server Ankur Halder',
    app: 'Natours',
  });
});

app.post('/', (req, res) => {
  res.status(200).send('posting!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on the port ${port}`);
});
