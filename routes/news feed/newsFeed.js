const router=require('express').Router();
const {createNewsFeed,getSingleNewsFeed}=require('../../controllers/news feed/newsFeed')
const {multerStorage}=require('../../utils/multer')
router.post('/create-newsFeed',multerStorage.single('banner'),createNewsFeed)
router.get('/getSingleNewsFeed/:id',getSingleNewsFeed)



module.exports=router;