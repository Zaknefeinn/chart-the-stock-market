const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  keys = require('./config/keys'),
  axios = require('axios'),
  async = require('async'),
  Stock = require('./models/stock.js'),
  http = require('http'),
  socketIO = require('socket.io');

mongoose.connect(keys.mongoURL).then(() => console.log('connected'));
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);

const io = socketIO(server);

io.on('connection', socket => {
  console.log('New client connected');
  //Add Symbol
  socket.on('add symbol', symbol => {
    const searchRequest = symbol.toUpperCase();

    axios
      .get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${searchRequest}&apikey=${
          keys.apiKEY
        }`
      )
      .then(e => {
        if (e.data['Error Message'] === undefined) {
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
                io.sockets.emit('add symbol', e.data);
              }
            } else {
              //if there is not a database
              Stock.create({ stocks: searchRequest }, (err, created) => {
                if (err) throw err;
              });
              io.sockets.emit('add symbol', e.data);
            }
          });
        } else {
          //handle "this stock does not exist"
        }
      });
  });

  //Remove Symbol
  socket.on('remove symbol', symbol => {
    Stock.find({}, (err, stocks) => {
      if (err) throw err;
      const newArr = stocks[0].stocks.filter(x => x !== symbol);
      Stock.findByIdAndUpdate(
        stocks[0]._id,
        { $set: { stocks: newArr } },
        (err, update) => {
          if (err) throw err;
        }
      );
      io.sockets.emit('remove symbol', newArr);
    });
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

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
      .then(allData => res.send(allData))
      .catch(err => console.log(err));
  });
});
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
