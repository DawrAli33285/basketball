const profileModel = require('../../models/profile/profile');
const universityModel = require('../../models/university/university');
const playerModel = require('../../models/player/player');
const videoModel=require('../../models/video/video')
const newsFeedModel=require('../../models/news feed/newsFeed')
const { cloudinaryUpload } = require('../../utils/cloudinary');
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
     
let videoData=await videoModel.find({featuredPlayer:id})
let newsFeedData=await newsFeedModel.find({})

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
        profile
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
