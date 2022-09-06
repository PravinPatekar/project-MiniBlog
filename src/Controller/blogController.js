const blogsModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")

// Validation
const isValid = function(value){
    if(typeof value === "undefined" || value === null ) return false
    if(typeof value === "string" || value.trim().length === 0 ) return false
    return true
  }
  
  const isValidTitle = function(title){
    return ["Mr", "Ms", "Miss"].indexOf(title) !== -1
  }
  
  const isValidRequestBody = function(requestBody){
    return Object.keys(requestBody).length > 0
  }

const createBlog=async function(req, res){
    try{
        let reqData = req.body
        if (!isValidRequestBody(reqData)) return res.status(400).send({ status: false, msg: "Body is Required"});
        
        if(isValidTitle(reqData.title)){
            res.status(400).send({status: false, msg: "Title is required"})
            return
        }
        
        if(isValid(reqData.body)){
            res.status(400).send({status: false, msg: "Body is required"})
            return
        }

        if(isValid(reqData.authorId)){
            res.status(400).send({status: false, msg: "Author Id is required"})
            return
        }

        if(isValid(reqData.category)){
            res.status(400).send({status: false, msg: "Category is required"})
            return
        }

        let savedData = await authorModel.findById(reqData.authorId)
        if (!savedData) res.status(400).send({ status: false, msg: "Author id does not exist in author collection"})

        let checkIsPublished = req.body.isPublished
        if(checkIsPublished==='true'){
            published= new Date().toISOString();
            reqData.publishedAt= published
        }
        let Blog=await blogsModel.create(reqData)
        res.status(201).send({status:true,"data":Blog}) 
    }
    catch(err) {
        console.log("ERROR: ", err.message)
        res.status(500).send({ msg: "ERROR:", error: err.message })
    }
}

const getBlogs = async function(req, res){
    try{
        let queryData= req.query
        if (isValidRequestBody(queryData)) {
            let findByQuery = await blogsModel.find({ $and: [{ isDeleted: false }, { isPublished: true }, queryData] } )
            if (findByQuery.length == 0) {
            return res.status(404).send({ status: false, msg: "No such data found" })
            }
            res.status(200).send({ status: true, data: findByQuery })
        } else {
            let findData = await blogsModel.find({ $and: [{ isDeleted: false }, { isPublished: true }] })
            if (!findData) {
                return res.status(404).send({ status: false, msg: "No such data found" })
            } else {
                res.status(200).send({ status: true, data: findData })
            }
        }
    } catch (error){
        console.log(error.message)
        res.status(500).send({ err: error.message })
    }
}

const updateBlogs = async function(req, res){
    try{
        let blogId = req.params.blogId;
      //  console.log(blogId)
        let data = req.body;
        if(Object.keys(data).length==0)
      //  if (!isValidRequestBody(data))
        return res.status(400).send({ status: false, msg: "Body is Required"});
        console.log("91")
        let blogData = await blogsModel.findById(blogId) // 
        console.log(blogData)
        
        if (!blogData) return res.status(404).send({ status: false, msg: "blogsId related data unavailable"});

        //authorization
        // if(req.headers["authorId"] !== blogData.authorId.toString()) return res.status(403).send({ status: false, msg: "You are not authorized...." })

        if (data.title) blogData.title = data.title;
        if (data.category) blogData.category = data.category;
        if (data.body) blogData.body = data.body;
        console.log("1010")
        if (data.tags) {
            if (typeof data.tags == "object") {
                blogData.tags.push(...data.tags);
            } else {
                blogData.tags.push(data.tags);
            }
        }
        
        if (data.category) {
            if (typeof data.subcategory == "object") {
                blogData.subcategory.push(...data.subcategory);
            } else {
                blogData.subcategory.push(data.subcategory);
            }
        }
        blogData.publishedAt = Date()
        blogData.isPublished = true;
        blogData.save();
        res.status(200).send({ status: true, data: blogData});
    } catch (error){
        console.log(error.message)
        res.status(500).send({ err: error.message})
    }
}

const deleteByBlogId = async function(req, res){
    try{
        let idOfBlog = req.params.blogId

        let blogData = await blogsModel.findById(idOfBlog)
        if(!blogData) return res.status(404).send({status: false, msg: "Blog not found, please provide valid blogId"})
        
        //authorization
        if(req.headers["authorId"] !== blogData.authorId.toString()) return res.status(403).send({ status: false, msg: "You are not authorized...." })

        deletedTime= new Date().toISOString();

        await blogsModel.findByIdAndUpdate({_id: idOfBlog},{isDeleted: true, deletedAt:deletedTime})

        res.status(200).send({ status: true, msg: "Blog Deleted Successfully"})
    } catch(error){
        console.log(error.message)
        res.status(500).send({ err: error.message})
    }
}

const deleteByQueryParams = async function(req, res){
    try{
        let data = req.query
        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, msg: "please enter filter for deletion" })
        let query = {
            isDeleted: false,
            authorId: req.headers["authorId"]
        }
        if (data.authorId){
            if(req.headers["authorId"] !== data.authorId) return res.status(403).send({ status: false, msg: "You are not authorized...." })
        }
        if (data.tags) {
            data.tags = { $in: data.tags.split(',') }
            console.log(data.tags)
        }
        if (data.subcategory) {
            data.subcategory = { $in: data.subcategory.split(',') }
        }
        query['$or'] = [
            { isPublished: data.isPublished },
            { authorId: data.authorId },
            { category: data.category },
            { subcategory: data.subcategory },
            { tags: data.tags }
        ]
        let del = await blogsModel.find(query)
        if (del.length == 0) {
            return res.status(404).send({ status: false, msg: "No such blog present"})
        }
        await blogsModel.updateMany(
            query, { $set: { isDeleted: true, DeletedAt: new Date().toLocaleString() } })
        res.status(200).send({ status: true, msg: "blogs deleted" })

    } catch(error){
        console.log(error.message)  
        res.status(500).send({ err: error.message})
    }
}

module.exports = { getBlogs, deleteByBlogId, deleteByQueryParams, createBlog, updateBlogs }