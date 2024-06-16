const mongoose=require('mongoose')

const profileSchema=mongoose.Schema({
auth:{
type:mongoose.Schema.ObjectId,
ref:'auth'
},
about:{
    type:String,
    required:true
},
coach:{
    type:mongoose.Schema.ObjectId,
    ref:'coach'
},
athleticaccomplishments:{
    type:[String]
},

socialLinks:{
    type:[{social_type:String,link:String}],
    required:true
},
player:{
    type:mongoose.Schema.ObjectId,
    ref:'player'
},
photos:{
    type:[String]
},
stats:{
type:[{
stats:{
    type:String,
    required:true
},
gp:{
    type:mongoose.Schema.Types.BigInt,
    required:true
},
fg:{
    type:mongoose.Schema.Types.BigInt,
    required:true
},
threep:{
    type:mongoose.Schema.Types.BigInt,
    required:true
},
ft:{
    type:mongoose.Schema.Types.BigInt,
    required:true
},
reb:{
    type:mongoose.Schema.Types.BigInt,
    required:true
},
ast:{
    type:mongoose.Schema.Types.BigInt,
    required:true
},
blk:{
    type:mongoose.Schema.Types.BigInt,
    required:true
},
stl:{
    type:mongoose.Schema.Types.BigInt,
    required:true
},
pf:{
    type:mongoose.Schema.Types.BigInt,
    required:true
},
to:{
    type:mongoose.Schema.Types.BigInt,
    required:true
},
pts:{
    type:mongoose.Schema.Types.BigInt,
    required:true
}
}]

},


offers:{
type:[
    {
        university:{
            type:String,
            required:true  
        },
        logo:{
        type:String,
        },
         status:{
            type:String,
            required:true
        
         },
         date:{
            type:Date,
            required:true
         }

    }
]
},
videos:{
    type:mongoose.Schema.ObjectId,
    ref:'video'
},
academics:{
    type:[{
        gpa:{
            type:String,
            required:true
        },
        satScore:{
            type:String,
            required:true
        },
        actScore:{
            type:String,
            required:true
        },
        ncaaId:{
            type:String,
            required:true 
        }
        
    }]
}
},{timestamps:true})
profileSchema.index({ auth: 1 });
profileSchema.index({ university: 1 });
profileSchema.index({ player: 1 });
const profileModel=mongoose.model('profile',profileSchema)
module.exports=profileModel;