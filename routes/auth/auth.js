const router=require('express').Router();
const {register,emailVerification,login}=require('../../controllers/auth/auth')


router.post('/register',register)
router.get('/verify/:token',emailVerification)
router.post('/login',login)

module.exports=router;