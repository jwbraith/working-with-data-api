const express = require('express');
const app = express();
const Datastore = require('nedb');
const port = 8000;
app.listen(port, () => console.log(`Listening at ${port}`));


app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('flanders.db');
database.loadDatabase();

app.post('/api', (req, res) => {
  const data = req.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  res.json(data);
});

app.get('/get-hist', (req, res) => {
  database.find({}, (err, data) => {
    if (err) {
      console.log(err);
      res.end();
    } else {
      res.json(data);

    }
  });
});

app.post('/clear', (req, res) => {
  console.log(req.body);
  console.log("clear button reached server");
  database.remove({}, { multi: true }, function (err, numRemoved) { });
  res.json({
    status: "success"
  });
})

