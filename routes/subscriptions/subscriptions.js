const router=require('express').Router();
const {authenticate}=require('../../middleware/authentication')
const {createSession,webhooks}=require('../../controllers/subscriptions/subscriptions')
router.post('/create-session',authenticate,createSession)
router.post('/webhooks',webhooks)



module.exports=router;