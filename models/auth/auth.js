const mongoose=require('mongoose')

let authSchema=mongoose.Schema({
    name:{
type:String,
required:true
    },
    phoneNumber:{
        type:String,
        validate:{
            validator:function(v){
                return /\d{10}/.test(v); 
            },
            message:props=>`${props.value} is not a valid phone number!`
        },
        
    },
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
role:{
    type:String,
}
},{
    timestamps:true
})


let authmodel=mongoose.model('auth',authSchema)

module.exports=authmodel