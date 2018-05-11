const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  keys = require('./config/keys'),
  axios = require('axios'),
  async = require('async');
Stock = require('./models/stock.js');

mongoose.connect(keys.mongoURL).then(() => console.log('connected'));
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/pull', (req, res) => {
  const data = [];
  let stocksArr;
  Stock.find({}, (err, stocks) => {
    if (err) throw err;
    stocksArr = stocks[0].stocks;
    stocksArr.map(x => {
      data.push(
        axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${x}&apikey=${
            keys.apiKEY
          }`
        )
      );
    });
    axios
      .all(data)
      .then(results => results.map(x => x.data))
      .then(allData => res.send(allData));
  }).catch(err => console.log(err));
});

app.post('/api/search', (req, res) => {
  const searchRequest = req.body.term.toUpperCase();
  // let arr = [];
  Stock.find({}, (err, term) => {
    if (err) throw err;
    //if there is a database
    let termArr = term[0].stocks;
    if (term.length > 0) {
      //check if stock isn't already in database
      if (termArr.indexOf(searchRequest) < 0) {
        termArr.push(searchRequest);
        Stock.findByIdAndUpdate(
          term[0]._id,
          { $set: { stocks: termArr } },
          (err, update) => {
            if (err) throw err;
          }
        );
      }
    } else {
      //if there is not a database
      Stock.create({ stocks: searchRequest }, (err, created) => {
        if (err) throw err;
      });
    }
  });
  res.end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
