const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: { 
    type: String, required: true, unique: true 
  },
  count: { 
    type: Number, default: 1 
  },
  lastVisited: { 
    type: Date, default: Date.now 
  },
  userAgent: { 
    type: String 
  },
  uaInfo: {
    type: Object,
    default: {}
  }
});


module.exports = mongoose.model('Visitor', visitorSchema);
