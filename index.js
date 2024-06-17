// //imports
// const express=require('express')
// const app=express();
// const connection=require('./connection/connection')
// const cors=require('cors')
// require('dotenv').config();
// const authRoutes=require('./routes/auth/auth')
// const profileRoutes=require('./routes/profile/profile')
// const newsFeedRoutes=require('./routes/news feed/newsFeed')
// const videoRoutes=require('./routes/video/video')
// const bodyParser=require('body-parser')
// const coachRoutes=require('./routes/coach/coach')
// const serverless = require("serverless-http");
// //middlewares
// app.use(cors())
// app.use(express.json({
//     verify: (req, res, buffer) => req['rawBody'] = buffer, 
//   }));
  
// app.use(express.urlencoded({
//     extended: true
//     }));



// //routes
// app.get('/',()=>{
//     return res.status(200).json({
//         message:"SUCCESS"
//     })
// })
// app.use(authRoutes)
// app.use(profileRoutes)
// app.use(newsFeedRoutes)
// app.use(videoRoutes)
// app.use(coachRoutes)
// //mongodb connection
// connection


// //server
// app.listen(process.env.PORT,()=>{
//     console.log(`Listening to port ${process.env.PORT}`)
// })



const express = require("express");
const serverless = require("serverless-http");
const connection = require('./connection/connection');
const cors = require('cors');
const authRoutes = require('./routes/auth/auth');
const profileRoutes = require('./routes/profile/profile');
const newsFeedRoutes = require('./routes/news feed/newsFeed');
const videoRoutes = require('./routes/video/video');
const coachRoutes = require('./routes/coach/coach');

const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use(express.json({
    verify: (req, res, buffer) => req['rawBody'] = buffer,
}));
app.use(express.urlencoded({
    extended: true
}));

// Routes
router.get("/", (req, res) => {
    res.status(200).json({ message: "SUCCESS" });
});

router.use(authRoutes);
router.use(profileRoutes);
router.use(newsFeedRoutes);
router.use(videoRoutes);
router.use(coachRoutes);

app.use("/.netlify/functions/app", router);

// MongoDB connection
connection;

// Serverless handler
module.exports.handler = serverless(app);
