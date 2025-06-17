const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./mongodb');
const Visitor = require('./model');

const app = express();
const port = 4000;

app.use(cors({
    origin:["https://visitorapis.vercel.app","https://www.shivanshdev.site/"]
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Route to save and count unique visitors
app.get('/api/visitor', async (req, res) => {
  try {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

    await Visitor.updateOne({ ip }, { $setOnInsert: { ip } }, { upsert: true });

    const count = await Visitor.countDocuments();
    console.log('route hit')
    res.json({ message: 'IP recorded', visitorCount: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


// Get count only
app.get('/api/visitor-count', async (req, res) => {
  const count = await Visitor.countDocuments();
  res.json({ visitorCount: count });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
