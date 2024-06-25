
let newsFeedModel=require('../../models/news feed/newsFeed')
const playerModel = require('../../models/player/player')
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


module.exports.getSingleNewsFeed=async(req,res)=>{
   let {id}=req.params

    try{
        let newsFeed=await newsFeedModel.findOne({_id:id}).populate('featuredPlayers')
        let players=[];
        for(let i=0;i<newsFeed.featuredPlayers.length;i++){
            let player=await playerModel.findOne({auth:newsFeed.featuredPlayers[i]?._id})
            players.push(player)
        }
        newsFeed=newsFeed.toObject();
       newsFeed={
...newsFeed,
players

       }
        return res.status(200).json({
            newsFeed,
        })
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
           error:"Server error please retry"
        })
    }
}


module.exports.deleteNewsFeed=async(req,res)=>{
  let {id}=req.params
    try{
        await newsFeedModel.deleteOne({_id:id})
        return res.status(200).json({
            message:"News feed deleted"
        })
    }catch(e){
        console.log(e.message)
        return res.status(400).json({
           error:"Server error please retry"
        }) 
    }
}

module.exports.editNewsFeed = async (req, res) => {
    const { id, title, description, featuredPlayers } = req.body;
    let banner = req.file;
  
    try {
      // Prepare data to update
      let updateData = {};
      if (title && title.length > 0) updateData.title = title;
      if (description && description.length > 0) updateData.description = description;
      if (featuredPlayers && featuredPlayers.length > 0) updateData.featuredPlayers = featuredPlayers;
  
      if (banner) {
        // If there is a new banner image
        const bannerDir = "/tmp/public/files/images";
        if (!fs.existsSync(bannerDir)) {
          fs.mkdirSync(bannerDir, { recursive: true });
        }
  
        let filename = `${Date.now()}-${banner.originalname}`;
        let finalname = path.join(bannerDir, filename);
  
        fs.writeFileSync(finalname, banner.buffer);
  
        let bannerUrl = await cloudinaryUpload(finalname);
  
        fs.unlinkSync(finalname);
  
        if (bannerUrl && bannerUrl.url) {
          updateData.banner = bannerUrl.url;
        }
      } else {
        // If no new banner image, remove banner field from updateData
        delete updateData.banner;
      }
  
      // Update the news feed entry
      let updatedNewsFeed = await newsFeedModel.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!updatedNewsFeed) {
        return res.status(404).json({ error: 'News feed not found' });
      }
  
      return res.status(200).json({
        message: "News feed successfully updated",
        newsFeed: updatedNewsFeed
      });
  
    } catch (e) {
      console.error(e.message);
      return res.status(500).json({
        error: 'Server error, please try again'
      });
    }
  };