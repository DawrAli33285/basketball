const profileModel = require('../../models/profile/profile');
const universityModel = require('../../models/university/university');
const playerModel = require('../../models/player/player');
const videoModel=require('../../models/video/video')
const newsFeedModel=require('../../models/news feed/newsFeed')
const { cloudinaryUpload } = require('../../utils/cloudinary');
const mailgun = require('mailgun.js');

const path = require('path');
const fs = require('fs');


module.exports.createProfile = async (req, res) => {
    let { about, phoneNumber,jerseyNumber,birthPlace, starRating, athleticaccomplishments, name, location, position, height, weight, offers, coach, socialLinks, stats, academics, playerClass, universityName } = req.body;

    const images = req.files['images'] || [];
    const logos=req.files['logo']
    let imagesUrls = [];
    let logoUrls=[]
    if (images.length > 0) {
        const imagesPath = "/tmp/public/files/images"
        let imagesFiles = images.map((val) => path.join(imagesPath, val.originalname));
        let logoFiles=logos.map((val)=>path.join(imagesPath,val.originalname))
        if (!fs.existsSync(imagesPath)) {
            fs.mkdirSync(imagesPath);
        }

        logos.forEach((val,i)=>{
          fs.writeFileSync(logoFiles[i],val.buffer)
        })
        images.forEach((val, i) => {
            fs.writeFileSync(imagesFiles[i], val.buffer);
        });

        const imageUploadPromises = imagesFiles.map((file) => cloudinaryUpload(file));
        const logoUploadPromises=logoFiles.map((file)=>cloudinaryUpload(file))

        const imageUploads = await Promise.all(imageUploadPromises);
        const logoUploads = await Promise.all(logoUploadPromises);
        imagesUrls = imageUploads.map((upload) => upload.url);
        logoUrls=logoUploads.map((upload)=>upload.url)
        images.forEach((val, i) => {
            fs.unlinkSync(imagesFiles[i], val.buffer);
        });
    }

    const picture = req.files['picture'] || null;
    let pictureUrl = null;
    if (picture) {
        const photosDir = "/tmp/public/files/photos"
        const originalPhotoName = picture[0].originalname;
        const photofileName = `${Date.now()}-${originalPhotoName}`;
        const photofile = path.join(photosDir, photofileName);

        if (!fs.existsSync(photosDir)) {
            fs.mkdirSync(photosDir);
        }

        fs.writeFileSync(photofile, picture[0].buffer);

        const photoUpload = await cloudinaryUpload(photofile);
        pictureUrl = photoUpload.url;
        fs.unlinkSync(photofile)
    }

    try {
        // Convert academics string to JSON object
        academics = JSON.parse(academics);

        // Convert offers string to JSON array
        offers = JSON.parse(offers);
        offers = offers.map((offer, index) => ({
          ...offer,
          logo: logoUrls[index] || null
      }));
        // Assuming universityName is used to create a university first
        const university = await universityModel.create({
            universityName
        });

        try {
            // Create player using the created university's _id
            const player = await playerModel.create({
                auth: req.user._id,
                picture: pictureUrl,
                name,
                location,
                position,
                height,
                weight,
                institute: university._id, // use university._id because create() expects an array
                class: playerClass,
                jerseyNumber,
                birthPlace
            });

            try {
                // Create profile linked to the created player
                const profile = await profileModel.create({
                    auth: req.user._id,
                    about,
                    player: player._id,
                    phoneNumber,
                    starRating,
                    athleticaccomplishments,
                    socialLinks,
                    stats,
                    coach,
                    offers,
                    academics,
                    photos: imagesUrls,
                });

                return res.status(200).json({
                    message: 'Profile created successfully',
                });
            } catch (profileError) {
                // Delete player and university if creating profile fails
                await playerModel.findByIdAndDelete(player._id);
                await universityModel.findByIdAndDelete(university._id);
                console.error(profileError.message);
                return res.status(500).json({
                    error: 'Server error. Please retry.'
                });
            }
        } catch (playerError) {
            // Delete university if creating player fails
            await universityModel.findByIdAndDelete(university._id);
            console.error(playerError.message);
            return res.status(500).json({
                error: 'Server error. Please retry.'
            });
        }
    } catch (universityError) {
        console.error(universityError.message);
        return res.status(500).json({
            error: 'Server error. Please retry.'
        });
    }
};



module.exports.getProfile = async (req, res) => {
    const { id } = req.params;
  
    try {
      let profile = await profileModel.findOne({ auth: id })
        .populate({
          path: 'player',
          populate: {
            path: 'institute',
            model: 'university'
          }
        })
        .populate('auth')
        .populate('coach');
        let players=await playerModel.find({}).populate('institute').populate('auth')
  
let videoData=await videoModel.find({featuredPlayer:id})
console.log(id)
let newsFeedData = await newsFeedModel.find({});
newsFeedData=newsFeedData.filter(u=>u?.featuredPlayers?.find(u=>u==id))


      if (!profile) {
        return res.status(404).json({
          error: "Profile not found"
        });
      }
  
  
      const careerStats = {
        
          stats: 'career',
          gp: 0,
          fg: 0,
          threep: 0,
          ft: 0,
          reb: 0,
          ast: 0,
          blk: 0,
          stl: 0,
          pf: 0,
          to: 0,
          pts: 0
        
      };
  
     
      if (profile.stats.length === 0) {
        careerStats.stats.gp = 0;
        careerStats.stats.fg = 0;
        careerStats.stats.threep = 0;
        careerStats.stats.ft = 0;
        careerStats.stats.reb = 0;
        careerStats.stats.ast = 0;
        careerStats.stats.blk = 0;
        careerStats.stats.stl = 0;
        careerStats.stats.pf = 0;
        careerStats.stats.to = 0;
        careerStats.stats.pts = 0;
      } else {
       
        profile.stats.forEach(stat => {
          careerStats.stats.gp++;
          careerStats.stats.fg += stat.fg;
          careerStats.stats.threep += stat.threep;
          careerStats.stats.ft += stat.ft;
          careerStats.stats.reb += stat.reb;
          careerStats.stats.ast += stat.ast;
          careerStats.stats.blk += stat.blk;
          careerStats.stats.stl += stat.stl;
          careerStats.stats.pf += stat.pf;
          careerStats.stats.to += stat.to;
          careerStats.stats.pts += stat.pts;
        });
      }
  let newprofile={
    ...profile.toObject(),
    videoData,
    newsFeedData
  }
  newprofile.stats.push(careerStats)
profile=newprofile
      return res.status(200).json({
        profile,
        players
      });
  
    } catch (e) {
      console.error(e.message);
      return res.status(500).json({
        error: 'Server error. Please retry.'
      });
    }
  };
module.exports.deleteProfile=async(req,res)=>{
    const {id}=req.params;
    try{
        let profile=await profileModel.deleteONe({auth:id})
        return res.status(200).json({
            profile
        })
        
    }catch(e){
        console.log(e.message)
        return res.status(500).json({
            error: 'Server error. Please retry.'
        });
    }
}
module.exports.getPlayer = async (req, res) => {
  try {
    // Fetch players and populate required fields
    let players = await playerModel.find({}).populate('institute').populate('auth');

    // Fetch all profiles
    let profiles = await profileModel.find({});

    // Create a map for quick lookup of profiles by auth ID
    let profileMap = new Map();
    profiles.forEach(profile => {
      profileMap.set(profile.auth.toString(), profile);
    });

    // Add offers to each player
    players = players.map(player => {
      const playerAuthId = player.auth._id.toString();
      if (profileMap.has(playerAuthId)) {
        player = player.toObject(); // Convert to plain object to modify
        player.offers = profileMap.get(playerAuthId).offers || [];
      } else {
        player.offers = [];
      }
      return player;
    });

    return res.status(200).json({
      players
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      error: 'Server error. Please retry.'
    });
  }
};

module.exports.getHomeData=async(req,res)=>{
  try{
let videosData=await videoModel.find({}).limit(9)
let newsFeedData=await newsFeedModel.find({}).limit(3)
let playersData=await playerModel.find({}).limit(6).populate('auth')
let classPlayers=await playerModel.find({class:'2024'}).limit(6).populate('auth')
return res.status(200).json({
 videosData,
 newsFeedData,
 playersData,
 classPlayers

})
  }catch(e){
    console.log(e.message);
    return res.status(500).json({
      error: 'Server error. Please retry.'
    });
  }
}


module.exports.contactUs=async(req,res)=>{
let {name,email,message}=req.body;
  try{
    const emailHtmlContent = `
<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 20px;
  }
  .container {
    max-width: 600px;
    margin: auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
  .header {
    color: #333;
    text-align: center;
  }
  .review {
    background-color: #f9f9f9;
    border-left: 4px solid #007BFF;
    margin: 20px 0;
    padding: 20px;
    border-radius: 4px;
  }
  .rating {
    text-align: right;
    font-size: 18px;
    font-weight: bold;
    color: #ff9500;
  }
</style>
</head>
<body>

<div class="container">
  <div class="header">
    <h2>User message by ${name}</h2>
  </div>

  <div>
  <p>${message}</p>
  </div>
</div>

</body>
</html>
`;
const DOMAIN = "sandboxea8015a234134c3e893de2a00954455a.mailgun.org";
const mg = mailgun({apiKey: "6fafb9bf-eb6cd277", domain: DOMAIN});
const data = {
from: "shahg33285@gmail.com",
to: email,
subject: "Contact Us",
html:emailHtmlContent
};
mg.messages().send(data,async function (error, body) {
  console.log(body);
  if(!error){
  await contactusmodel.findByIdAndUpdate(id,{
      status:"answered"
  })
  return res.status(200).json({
      message:'sucess'
  })
  }else{
  console.log(error)
  return res.status(400).json({
      message:error
  })
  }
  });
}catch(e){
  console.log(e.message);
  return res.status(500).json({
    error: 'Server error. Please retry.'
  });
}
}