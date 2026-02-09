const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./mongodb');
const Visitor = require('./model');
const UAParser = require('ua-parser-js');
const generate = require('./google');
const app = express();
const port = 4000;


app.use(cors({
  origin:"*"
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

const data ={
  "name": "Shivansh Kamboj",
  "location": "Karnal, Haryana",
  "email": "kambojshivansh2004@gmail.com",
  "mobile": "8708606784",
  "linkedin": "https://linkedin.com/in/shivanshkamboj/",
  "technicalSkills": {
    "languages": ["C++", "HTML", "CSS", "JavaScript"],
    "frameworksLibraries": ["Tailwind", "React JS", "Node JS", "Express JS"],
    "developerTools": ["VS Code", "Git/Github"],
    "database": ["MongoDB"]
  },
  "education": [
    {
      "institution": "JMIT, Radaur, Yamunanagar",
      "degree": "Bachelor of Technology in Information Technology",
      "duration": "Aug 2021 - June 2025"
    },
    {
      "institution": "Indian Public School, Radaur",
      "degree": "Secondary Education",
      "duration": "April 2020 - March 2021"
    }
  ],
  "training": {
    "program": "Hoping Minds Trainee",
    "location": "Mohali",
    "duration": "July 2024 – August 2024",
    "details": [
      "Developed and led the implementation of a full-stack real estate platform using React.js, Node.js, and MongoDB",
      "Optimized content management and user interaction for an enhanced experience",
      "Integrated JWT authentication for secure user data access",
      "Used bcrypt for encrypted password storage"
    ]
  },
  "projects": [
    {
      "name": "Tin-Dev - Connecting Developer Platform",
      "techStack": ["React JS", "MongoDB", "Express JS", "Node JS"],
      "date": "May 2025",
      "description": [
        "Designed and developed a platform that connects developers for collaboration and networking",
        "Implemented Redux for state management",
        "Integrated JWT for secure authentication and bcrypt for password storage",
        "Implemented chat using WebSocket for real-time communication"
      ]
    },
    {
      "name": "ScholarsBridge - Online Education Platform",
      "techStack": ["React JS", "MongoDB", "Express JS", "Node JS"],
      "date": "October 2024",
      "description": [
        "Developed an interactive platform for teachers to list and students to access educational content",
        "Integrated Razorpay for payment processing",
        "Used Cloudinary for secure cloud-based data storage",
        "Optimized routing for improved navigation",
        "Integrated Nodemailer for email notifications",
        "Deployed the app on Vercel for scalable hosting"
      ]
    },
    {
      "name": "Medicare - Online Doctor Appointment Platform",
      "techStack": ["React JS", "MongoDB", "Express JS", "Node JS"],
      "date": "June 2024",
      "description": [
        "Developed a platform for scheduling appointments between doctors and patients",
        "Implemented Context API for state management",
        "Integrated Razorpay for payments and Cloudinary for storage",
        "Built an admin module to manage doctors and appointments",
        "Optimized responsive design for laptops and mobile devices"
      ]
    }
  ],
  "extracurricular": [
    "Secured first place in a college-level web development competition",
    "Solved 250+ problems on Arrays, Strings, Recursion, Linked Lists, Stacks, and Trees"
  ],
  "familyBackground": {
    "members": ["Father", "Mother", "Sister"],
    "fatherTraits": ["Trust", "Time Constraints", "Integrity"]
  },
  "personalityTraits": [
    "Dedicated toward work",
    "Consistent",
    "Good at understanding problems and emotions",
    "Listens first in disagreements",
    "Team experience as a leader (led 3 projects)"
  ],
  "interests": [
    "Full stack development",
    "Data Structures and Algorithms",
    "Gaming",
    "Spending time with family",
    "Walking in farming fields"
  ],
  "careerGoals": "I want a job that motivates me and allows me to keep learning. After 5 years I want to build trust that I can confidently handle any type of work.",
  "approachToFailure": "I consider failure as one step toward success.",
  "communicationSkills": "My English speaking skills are decent and improving. I prefer listening first to understand the situation before responding.",
  "readingHabits": "I generally read documentation required for development.",
  "conflictResolutionStyle": "I first listen carefully, try to understand the reasons behind disagreement, analyze the situation and skill sets involved, and then rework on a better solution collaboratively.",
  "plansForFuture": {
    "higherStudies": "No, I don't have plans right now.",
    "relocation": "Open to opportunities."
  },
  "definitionOfSuccess": "Being healthy, earning and learning enough, and behaving well regardless of ego.",
  "workPreferences": {
    "preferredEnvironment": "Structured work",
    "deadlines": "Okay with strict deadlines",
    "companyType": "Prefer startup due to more learning opportunities"
  },
  "prioritizationStyle": "I make plans for what time to give to which task, and prioritize based on complexity and importance. I can work on multiple projects but need to make a structured timetable."
}
app.post('/api/room/ai',async(req,res)=>{
    const prompt = `
        You are given this context:
        ${JSON.stringify(data)}
        your name is shivansh act like a human
        Answer this question in max 15 lines use emojis headings and use simple english and dont tell anything about you know context:
        ${req.body.message}

        If you don't know, say you don't know.
        `;

    const message=await generate(prompt)
    return res.json({
        message
    })
})
app.get('/', (req, res) => {
  console.log("api is working" , Date.now())
  res.json({ work: 'api working' });
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
