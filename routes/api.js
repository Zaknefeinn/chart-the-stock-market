const express = require('express'),
  router = express.Router(),
  axios = require('axios'),
  Stock = require('../models/stock.js');

router.get('/api/pull', (req, res) => {
  const data = [];
  let stocksArr;
  Stock.find({}, (err, stocks) => {
    if (err) throw err;
    stocksArr = stocks[0].stocks;
    stocksArr.map(x => {
      data.push(
        axios
          .get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${x}&apikey=${
              keys.apiKEY
            }`
          )
          .catch(err => console.log('error'))
      );
    });
    axios
      .all(data)
      .then(results => results.map(x => x.data))
      .then(allData => res.send(allData))
      .catch(err => console.log(err));
  });
});

module.exports = router;
