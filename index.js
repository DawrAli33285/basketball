//imports
const express=require('express')
const app=express();
const connection=require('./connection/connection')
const cors=require('cors')
require('dotenv').config();
const authRoutes=require('./routes/auth/auth')
const profileRoutes=require('./routes/profile/profile')
const newsFeedRoutes=require('./routes/news feed/newsFeed')
const videoRoutes=require('./routes/video/video')
const coachRoutes=require('./routes/coach/coach')
//middlewares
app.use(cors())
app.use(express.json({
    verify: (req, res, buffer) => req['rawBody'] = buffer, 
  }));
  
app.use(express.urlencoded({
    extended: true
    }));



//routes
app.use(authRoutes)
app.use(profileRoutes)
app.use(newsFeedRoutes)
app.use(videoRoutes)
app.use(coachRoutes)
//mongodb connection
connection


//server
app.listen(process.env.PORT,()=>{
    console.log(`Listening to port ${process.env.PORT}`)
})