const mongoose = require('mongoose');
require("dotenv").config()
const connectDB = async () => {
  try {
     console.log("MONGO URI =>", process.env.MONGO);
    await mongoose.connect(process.env.MONGODB_URL,{
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
};

module.exports = connectDB;
