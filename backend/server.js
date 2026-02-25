const express = require('express')
const router = express.Router()
dotenv = require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const path = require('path');
const MongoStore = require('connect-mongo').default;

//Define app
const app = express()

app.use(express.json());

const port = process.env.PORT

//Cors Settings
const devOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176", // Vite
  "http://localhost:3000", // React dev server / same port sometimes
  "http://localhost:4200", // Angular
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:4200",
];

app.use(
  cors({
    origin: devOrigins,          // do NOT use "*" with credentials
    credentials: true,           // needed if frontend uses fetch(..., { credentials: 'include' })
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//Mongoose
const mongoUrl = process.env.MONGO_URL;

const mongoose = require('mongoose');

const connectToMongo = async () => {
  await mongoose.connect(mongoUrl);
}

try {
    connectToMongo();
    console.log("Successfully connected to Mongo Database")
} catch(err) {
    console.log("failed to connect to MongoDB with error: " + err);
}

//Session

const store = MongoStore.create({
      mongoUrl: process.env.MONGO_URL, // your Mongo connection string
      collectionName: "autobody_sessions",
      ttl: 60 * 60 * 24 * 7, // seconds
})

app.use(
  session({
    name: "autobody", // cookie name
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // true behind HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
    store: store,
  })
);


app.use(express.json());

app.use('/api/bodyshop', require('./routes/bodyshop'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/user', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/estimatequery', require('./routes/estimatequery'));
app.use('/api/estimatephoto', require('./routes/estimatephoto'));
app.use('/api/estimates', require('./routes/estimate'));
app.use('/api/s3', require('./routes/upload'));


// Serve frontend build
app.use(express.static(path.join(__dirname, "build")));

// SPA fallback (must be last)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

//Start Server
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`)
})

module.exports = app;
