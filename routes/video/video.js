const router=require('express').Router();
const {multerStorage}=require('../../utils/multer')
const {createVideo,updateViews,flagVideo,getVideos,deleteVideo,editVideo}=require('../../controllers/video/video');
const { authenticate } = require('../../middleware/authentication');

router.post('/create-video',multerStorage.single('video'),createVideo)
router.get('/updateViews/:id/:userid',updateViews)
router.get('/getVideos',getVideos)
router.get('/flag-video/:id',authenticate,flagVideo)
router.delete('/delete-video/:id',deleteVideo)
router.post('/editVideo',multerStorage.single('video'),editVideo)

module.exports=router;