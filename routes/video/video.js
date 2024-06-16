const router=require('express').Router();
const {multerStorage}=require('../../utils/multer')
const {createVideo,updateViews}=require('../../controllers/video/video')

router.post('/create-video',multerStorage.single('video'),createVideo)
router.get('/updateViews/:id/:userid',updateViews)


module.exports=router;