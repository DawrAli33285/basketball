const router=require('express').Router();
const {createNewsFeed}=require('../../controllers/news feed/newsFeed')
const {multerStorage}=require('../../utils/multer')
router.post('/create-newsFeed',multerStorage.single('banner'),createNewsFeed)




module.exports=router;