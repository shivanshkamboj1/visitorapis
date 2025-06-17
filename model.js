const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  visits: [
    {
      ip: { type: String, unique: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

// Note: Mongoose doesn't enforce `unique` inside arrays, so uniqueness will be handled manually.

module.exports = mongoose.model('Visitor', visitorSchema);
