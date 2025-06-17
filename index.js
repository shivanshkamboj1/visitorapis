const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./mongodb');
const Visitor = require('./model');

const app = express();
const port = 4000;

app.use(cors({
    origin:["https://visitorapis-hy6o.vercel.app","https://www.shivanshdev.site"]
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Route to save and count unique visitors
app.post('/api/visitor', async (req, res) => {
  try {
    const { ip } = req.body;

    if (!ip) {
      return res.status(400).json({ error: 'IP address is required in the request body' });
    }

    await Visitor.updateOne(
      {}, // We use a single document to hold all visits
      { $push: { visits: { ip } } },
      { upsert: true }
    );

    const doc = await Visitor.findOne({});
    const count = doc?.visits?.length || 0;

    console.log(`✅ Visitor IP recorded: ${ip}`);

    res.json({ message: 'IP recorded', visitorCount: count });
  } catch (err) {
    console.error('❌ Error recording visitor:', err);
    res.status(500).json({ error: 'Database error' });
  }
});



// Get count only
app.get('/api/visitor-count', async (req, res) => {
  const doc = await Visitor.findOne({});
  const count = doc?.visits?.length || 0;
  res.json({ visitorCount: count });
});

app.get('/', (req, res) => {
  res.json({ work: 'api working' });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
