const mongoose = require('mongoose');
require("dotenv").config()
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL,{
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
};

module.exports = connectDB;
