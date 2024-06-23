const router=require('express').Router();
const {multerStorage}=require('../../utils/multer')
const {createVideo,updateViews,flagVideo}=require('../../controllers/video/video');
const { authenticate } = require('../../middleware/authentication');

router.post('/create-video',multerStorage.single('video'),createVideo)
router.get('/updateViews/:id/:userid',updateViews)
router.get('/flag-video/:id',authenticate,flagVideo)


module.exports=router;