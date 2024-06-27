const router=require('express').Router();
const {createNewsFeed,getPlayers,editNewsFeed ,getSingleNewsFeed,getNewsFeed,deleteNewsFeed}=require('../../controllers/news feed/newsFeed')
const {multerStorage}=require('../../utils/multer')
router.post('/editNewsFeed',multerStorage.single('banner'),editNewsFeed)
router.post('/create-newsFeed',multerStorage.single('banner'),createNewsFeed)
router.get('/getSingleNewsFeed/:id',getSingleNewsFeed)
router.get('/getNewsFeed',getNewsFeed)

router.delete('/delete-news/:id',deleteNewsFeed)
router.get('/getPlayers',getPlayers)
module.exports=router;