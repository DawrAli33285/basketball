const router=require('express').Router();
const {register,changePassword,adminLogin,adminRegister,forgetPassword,emailVerification,login}=require('../../controllers/auth/auth')


router.post('/register',register)
router.get('/verify/:token',emailVerification)
router.post('/login',login)
router.post('/forgetPassword',forgetPassword)
router.post('/changePassword',changePassword)
router.post('/adminRegister',adminRegister)
router.post('/adminLogin',adminLogin)

module.exports=router;