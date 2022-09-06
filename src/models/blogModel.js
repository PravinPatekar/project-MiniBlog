const mongoose=require('mongoose')
const objectID= mongoose.Schema.Types.ObjectId

//
const blogSchema=new mongoose.Schema({
  title:{
    type:String,
    required:true,
    trim: true
  },
  body:{
    type:String,
    required:true,
    trim: true
  },
  authorId:{
    type:objectID,
    ref:'Author',
    require:true
  },
  tags:{
    typeof:[{type:String,
    trim: true}]
  },
  category: [{type:[String],
    trim: true,
    require: true}]
  ,
  subcategory:
    [{type:[String],
    trim: true}]
  ,
  deletedAt:{
    type:String,
    default:null
  },
  isDeleted:{
    type:Boolean,
    default:false
  },
  publishedAt:{
    type:String,
    default:null
  },
  isPublished:{
    type:Boolean,
    default:false
  }
}, {timestamps:true})

module.exports=mongoose.model('Blog', blogSchema)