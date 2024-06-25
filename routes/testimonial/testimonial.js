const router=require('express').Router();
const {createTestimonial}=require('../../controllers/testmonial/testmonial')
const {multerStorage}=require('../../utils/multer')
router.post('/create-testimonial',multerStorage.single('image'),createTestimonial)


module.exports=router;