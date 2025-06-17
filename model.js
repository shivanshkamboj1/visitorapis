const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 },
  lastVisited: { type: Date, default: Date.now },
});
// Note: Mongoose doesn't enforce `unique` inside arrays, so uniqueness will be handled manually.

module.exports = mongoose.model('Visitor', visitorSchema);
