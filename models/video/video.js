const mongoose=require('mongoose')
const videoSchema=mongoose.Schema({
    featuredPlayer:{
        type:mongoose.Schema.ObjectId,
        ref:'auth'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    video:{
        type:String,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    viewedBy:{
        type:[
            {
                type:mongoose.Schema.ObjectId,
                ref:'auth'
            }
            ]
    },
    flaggedBy:{
        type:[
            {
                type:mongoose.Schema.ObjectId,
                ref:'auth'
            }
        ]
    }
},{timestamps:true})

const videomodel=mongoose.model('video',videoSchema)
module.exports=videomodel