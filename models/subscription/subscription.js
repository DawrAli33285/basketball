const mongoose=require('mongoose')

const subscriptionSchema=mongoose.Schema({
email:{
    type:String,
    required:true
},
name:{
    type:String,
    required:true
},
expires_at:{
    type:String,
    required:true
},
amount:{
    type:String,
    required:true
},
subtype:{
    type:String,
    required:true
}
},{timestamps:true})

let subscriptionmodel=mongoose.model('subscriptions',subscriptionSchema)

module.exports=subscriptionmodel;