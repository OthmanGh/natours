const fs = require('fs');
const express = require('express');

const port = 3000;
const app = express();

app.use(express.json());

const toursJSONPath = `${__dirname}/dev-data/data/tours-simple.json`;

let tours = JSON.parse(fs.readFileSync(toursJSONPath, 'utf-8'));

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(toursJSONPath, JSON.stringify(tours), 'utf-8', (err) => {
    if (err) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to write to tours file',
      });
    } else {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
