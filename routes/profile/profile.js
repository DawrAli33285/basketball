const router=require('express').Router();
const {createProfile,getProfile,flagProfile,deleteProfile,subscribeMail,contactUs,getPlayer,getHomeData}=require('../../controllers/profile/profile')
const {authenticate}=require('../../middleware/authentication')
const {multerStorage}=require('../../utils/multer')
router.post('/create-profile',authenticate,multerStorage.fields([
    {name:'images',maxCount:10},
    {name:'picture',maxCount:1},
]),createProfile)

router.get('/get-profile/:id',getProfile)
router.delete('/delete-profile/:id',deleteProfile)
router.get('/getPlayer',getPlayer)
router.get('/getHomeData',getHomeData)
router.post('/contactUs',contactUs)
router.post('/subscribeMail',subscribeMail)
router.get('/flagProfile/:id',authenticate,flagProfile)
module.exports=router;