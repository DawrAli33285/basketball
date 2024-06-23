const router=require('express').Router();
const {register,changePassword,forgetPassword,emailVerification,login}=require('../../controllers/auth/auth')


router.post('/register',register)
router.get('/verify/:token',emailVerification)
router.post('/login',login)
router.post('/forgetPassword',forgetPassword)
router.post('/changePassword',changePassword)
module.exports=router;