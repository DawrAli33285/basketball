const mongoose=require('mongoose')

const playerSchema=mongoose.Schema({
    auth:{
type:mongoose.Schema.ObjectId,
ref:'auth'
    },
starRating:{
    type:Number,
    default:0
},
picture:{
    type:String,
    required:true
},

institute:{
    type:mongoose.Schema.ObjectId,
    ref:'university'
},
location:{
    type:String,
    required:true
},
position:{
    type:String,
    required:true
},
height:{
    type:String,
    required:true
},
weight:{
    type:String,
    required:true
},
class:{
    type:String,
    required:true
},
jerseyNumber:{
    type:Number,
    required:true
},
birthPlace:{
    type:String,
    required:true
}
},{timestamps:true})

const playerModel=mongoose.model('player',playerSchema)
module.exports=playerModel