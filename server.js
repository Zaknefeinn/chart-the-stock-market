const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  keys = require('./config/keys'),
  axios = require('axios');

mongoose.connect(keys.mongoURL).then(() => console.log('connected'));
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/*', (req, res) => {
  let data = 'hit';
  axios
    .get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=tsla&interval=1min&apikey=${
        keys.apiKEY
      }`
    )
    .then(response => {
      data = response.data;
      res.send(data);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
