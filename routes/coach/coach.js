const router=require('express').Router();
const {createCoach}=require('../../controllers/coach/coach')
router.post('/create-coach',createCoach)



module.exports=router;