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
    type:String
},
gp:{
    type:mongoose.Schema.Types.BigInt
},
fg:{
    type:mongoose.Schema.Types.BigInt
},
threep:{
    type:mongoose.Schema.Types.BigInt
},
ft:{
    type:mongoose.Schema.Types.BigInt
},
reb:{
    type:mongoose.Schema.Types.BigInt
},
ast:{
    type:mongoose.Schema.Types.BigInt
},
blk:{
    type:mongoose.Schema.Types.BigInt
},
stl:{
    type:mongoose.Schema.Types.BigInt
},
pf:{
    type:mongoose.Schema.Types.BigInt
},
to:{
    type:mongoose.Schema.Types.BigInt
},
pts:{
    type:mongoose.Schema.Types.BigInt
}
}]

},


offers:{
type:[
    {
        university:{
            type:String,
           
        },
        logo:{
        type:String,
        },
         status:{
            type:String,

        
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
flaggedBy:{
    type:[
    {
        type:mongoose.Schema.ObjectId,
        ref:'auth'
    }
    ]
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
         
        }
        
    }]
}
},{timestamps:true})
profileSchema.index({ auth: 1 });
profileSchema.index({ university: 1 });
profileSchema.index({ player: 1 });
const profileModel=mongoose.model('profile',profileSchema)
module.exports=profileModel;