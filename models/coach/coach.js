const mongoose=require('mongoose')

const coachSchema=mongoose.Schema({
    name:{
        type:String,
       
    },
    phone:{
        type:String,
        validate:{
            validator:function(v){
                return /\d{10}/.test(v); 
            },
            message:props=>`${props.value} is not a valid phone number!`
        },
        required:true
    },
    email:{
        type:String,
    
    },
    coachProgram:{
        type:String,
    },
    auth:{
        type:mongoose.Schema.ObjectId,
        ref:'auth'
    },
    type:{
        type:String,
    }
})

const coachmodel=mongoose.model('coach',coachSchema)
module.exports=coachmodel