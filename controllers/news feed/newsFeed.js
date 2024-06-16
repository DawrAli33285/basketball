
let newsFeedModel=require('../../models/news feed/newsFeed')
const {cloudinaryUpload}=require('../../utils/cloudinary')
const fs=require('fs')
const path=require('path')
module.exports.createNewsFeed=async(req,res)=>{
    let {title,description,featuredPlayers}=req.body
    let banner = req.file;
    try{
        const bannerDir = "/tmp/public/files/images"
        if (!fs.existsSync(bannerDir)) {
            fs.mkdirSync(bannerDir, { recursive: true });
          }
      
         
          let filename = `${Date.now()}-${banner.originalname}`;
          let finalname = path.join(bannerDir, filename);
      
          fs.writeFileSync(finalname, banner.buffer);
      
          
          let bannerUrl = await cloudinaryUpload(finalname);
      
         
          fs.unlinkSync(finalname);
      
 await newsFeedModel.create({
    title,
    description,
    featuredPlayers,
    banner:bannerUrl.url
 })
 return res.status(200).json({
    message:"News feed successfully created"
 })

    }catch(e){
        console.log(e.message)
        return res.status(400).json({
           error:"Server error please retry"
        })
    }   
}


module.exports.getNewsFeed=async(req,res)=>{
    try{
   let news=await newsFeedModel.find({})
return res.status(200).json({
    news
})
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
           error:"Server error please retry"
        })
    }
}



