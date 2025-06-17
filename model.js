
const mongoose = require('mongoose');

const visitorSchemaa = new mongoose.Schema({
  ip: { type: String, unique: true },
  timestamp: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Visitor', visitorSchemaa);
