const videoModel=require('../../models/video/video')
const fs=require('fs')
const path=require('path')
const {cloudinaryUpload}=require('../../utils/cloudinary')

module.exports.createVideo = async (req, res) => {
    let { title, description, featuredPlayer } = req.body;
    let video = req.file;
  
    try {
    
      // const videoDir = path.join(__dirname, '..', '..', 'videos');
      
   const videoDir = "/tmp/public/files/images"
      if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir, { recursive: true });
      }
  
     
      let filename = `${Date.now()}-${video.originalname}`;
      let finalname = path.join(videoDir, filename);
  
      fs.writeFileSync(finalname, video.buffer);
  
      
      let videoUrl = await cloudinaryUpload(finalname);
  
     
      fs.unlinkSync(finalname);
  
     
      await videoModel.create({
        title,
        description,
        featuredPlayer,
        video: videoUrl.url
      });
  
    
      return res.status(200).json({
        message: 'Video created successfully'
      });
  
    } catch (e) {
      console.log(e.message);
      return res.status(500).json({
        error: 'Server error, please try again'
      });
    }
  };



  module.exports.updateViews=async(req,res)=>{
let {id}=req.params
let {userid}=req.params;
console.log(userid)
console.log(id)
    try{
let alreadyviewed=await videoModel.findOne({_id:id,'viewedBy':userid})
if(alreadyviewed){
  return res.json({
    message:"Already viewed"
  })
}

let oldview=await videoModel.findOne({_id:id})
let newviews=parseInt(oldview.views)+1
await videoModel.updateOne({_id:id},{$set:{views:newviews},$push:{viewedBy:userid}})
return res.status(200).json({
    message:"views updated sucessfully"
})
    }catch(e){
        console.log(e.message);
        return res.status(500).json({
          error: 'Server error, please try again'
        });
    }
  }