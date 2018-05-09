const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  keys = require('./config/keys'),
  axios = require('axios'),
  Stock = require('./models/stock.js');

mongoose.connect(keys.mongoURL).then(() => console.log('connected'));
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/pull', (req, res) => {
  axios
    .get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=${
        keys.apiKEY
      }`
    )
    .then(response => {
      data = response.data;
      res.send(data);
    });
});

app.post('/api/search', (req, res) => {
  const searchRequest = req.body.term.toUpperCase();
  let arr = [];
  Stock.find({ stocks: searchRequest }, (err, term) => {
    if (term.length > 0) {
    } else {
      if (err) throw err;
      else {
        Stock.create({ stocks: searchRequest }, (err, created) => {
          if (err) throw err;
        });
      }
    }
  });
  res.end();
});
// app.get('/api/search/:id', (req, res) => {
//   const searchRequest = req.params.id;
//   Stock.find({ searchRequest }, (err, item) => {
//     if (err) throw err;
//     console.log(item);
//   });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
