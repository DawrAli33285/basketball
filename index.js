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
// app.use(cors())
app.use(cors())
app.options('*',cors({
    origin:'*', 
    credentials:true,
    methods:['POST','GET','DELETE','UPDATE'],            
    optionSuccessStatus:200
}))
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

app.use(function (req,res, next) {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    next(); 
  });
app.use(express.json({
    verify: (req, res, buffer) => req['rawBody'] = buffer, 
  }));
  
app.use(express.urlencoded({
    extended: true
    }));



//routes
app.get('/',(req,res)=>{
    return res.status(200).json({
        message:"SUCCESS"
    })
})
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


