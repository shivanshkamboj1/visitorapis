const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./mongodb');
const Visitor = require('./model');
const UAParser = require('ua-parser-js');
const app = express();
const port = 4000;


app.use(cors({
  origin:["https://www.shivanshdev.site"]
}));
app.use(express.json());


connectDB();


app.post('/api/visitor', async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0];
    const parser = new UAParser(req.headers['user-agent']);
    const result = parser.getResult();

    if (!ip) {
      return res.status(400).json({ error: 'IP address is required in the request body' });
    }

    let doc = await Visitor.findOne({ip});

    if (!doc) {
      doc = new Visitor({
          ip, userAgent: result.ua,
          uaInfo: result 
      });
      await doc.save();
    } else {
      // Check if the IP already exists
      await Visitor.findOneAndUpdate({ip}, { $inc: { count: 1 }, $set: { lastVisited: new Date() ,userAgent: result.ua,uaInfo: result} });
    }
    res.sendStatus(204); 
  } catch (err) {
    console.error('Error recording visitor:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


app.get('/api/visitor-count', async (req, res) => {
  const count = await Visitor.countDocuments();
    res.json({ visitorCount: count });
});

app.get('/api/visitor-list', async (req, res) => {
  try {
    const visitors = await Visitor.find({}, 'ip');
    const ipList = visitors.map(visitor => visitor.ip);

    res.json({ ipList });
  } catch (err) {
    console.error('Error fetching IP list:', err);
    res.status(500).json({ error: 'Failed to fetch IP list' });
  }
});


app.get('/', (req, res) => {
  res.json({ work: 'api working' });
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
