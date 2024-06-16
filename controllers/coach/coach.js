const coachModel=require('../../models/coach/coach')


module.exports.createCoach=async(req,res)=>{
let { name,
    coachProgram,
    phone,
    email}=req.body
    try{
await coachModel.create({
    name,
    coachProgram,
    phone,
    email
})
return res.status(200).json({
    message:"Coach created sucessfully"
})

    }catch(e){
        console.log(e.message)
        return res.status(400).json({
           error:"Server error please retry"
        })
    }
}