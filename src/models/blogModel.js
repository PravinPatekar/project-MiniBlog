const mongoose =require('mongoose')

const ObjectId =mongoose.Schema.Types.ObjectId    // refers to author id so we use this refrence is used here
const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    authorId:{
        type:ObjectId,
        ref:'project1_Author',
        required:true
    },
    tags:[String],
    category:{
        type:String,
        required: true
    },
    subcategory:[String],
    deleteAt:{
        type:Date,
        default:null
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    publishedAt:{
        type:
        Date,
        default:null
    },
    isPublished:{
        type:Boolean,
        default:false
    }

},{timestamps:true})
module.exports= mongoose.model('project1_Blog',blogSchema)