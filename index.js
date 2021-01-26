const express = require('express');
const app = express();
const Datastore = require('nedb');
app.listen(8000, () => console.log('Listening at 8000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('flanders.db');
database.loadDatabase();

app.post('/api', (req, res) => {
  const timestamp = Date.now();
  req.body.timestamp = timestamp;
  database.insert(req.body);
  res.json({
    status: "success",
    latitude: req.body.lat,
    longitude: req.body.lngi
  });
})
