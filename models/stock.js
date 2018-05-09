const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  stocks: [String]
});

module.exports = mongoose.model('stocks', stockSchema);
