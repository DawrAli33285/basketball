const router=require('express').Router();
const {createProfile,getProfile,deleteProfile,contactUs,getPlayer,getHomeData}=require('../../controllers/profile/profile')
const {authenticate}=require('../../middleware/authentication')
const {multerStorage}=require('../../utils/multer')
router.post('/create-profile',authenticate,multerStorage.fields([
    {name:'images',maxCount:10},
    {name:'picture',maxCount:1},
    {name:'logo',maxCount:5}
]),createProfile)

router.get('/get-profile/:id',getProfile)
router.delete('/delete-profile/:id',deleteProfile)
router.get('/getPlayer',getPlayer)
router.get('/getHomeData',getHomeData)
router.post('/contactUs',contactUs)
module.exports=router;