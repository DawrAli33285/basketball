const router=require('express').Router();
const {authenticate}=require('../../middleware/authentication')
const {createSession}=require('../../controllers/subscriptions/subscriptions')
router.post('/create-session',authenticate,createSession)




module.exports=router;