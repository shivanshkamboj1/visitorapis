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

    let doc = await Visitor.findOne({});

    // If no document exists, create one and add the IP
    if (!doc) {
      doc = new Visitor({ visits: [{ ip }] });
      await doc.save();
    } else {
      // Check if the IP already exists
      const alreadyExists = doc.visits.some(v => v.ip === ip);

      if (!alreadyExists) {
        doc.visits.push({ ip });
        await doc.save();
      }
    }

    const count = doc.visits.length;
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

app.get('/api/visitor-list', async (req, res) => {
  try {
    const doc = await Visitor.findOne({});
    const ipList = doc?.visits?.map(v => v.ip) || [];

    res.json({ ipList });
  } catch (err) {
    console.error('❌ Error fetching IP list:', err);
    res.status(500).json({ error: 'Failed to fetch IP list' });
  }
});

app.get('/', (req, res) => {
  res.json({ work: 'api working' });
});
app.get('/visitor-show',async(req,res)=>{
  const ip = req.headers["x-forwarded-for"]?.split(",")[0];
  console.log("User IP:", ip);
  res.json({ status: "success", ip });
})
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
