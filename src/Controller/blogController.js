const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const router = require("../routes/route")

const createBlog = async function (req, res) {
    let blog = req.body;
    let blogCreated = await blogModel.create(blog)
    res.send({ data: blogCreated })
}

const getBlog = async function (req, res) {
    try{

        let blogs = await blogModel.find({ isDeleted: false, isPublished: true })
        let size = blogs.length
        if (size < 1) return res.status(404).send({ msg: "blog not found" })
        return res.status(200).send({ data: blogs })
    }
    catch(error){
        res.status(500).send({msg:error.message})
    }
}
const filterBlogsDetails = async function (req, res) {
    try {
        let { authorId, category, subcategory,tags} = req.query
        let query = {};
        if (authorId) query.authorId = authorId;
        if (category) query.category = category;
        if (subcategory) query.subcategory = subcategory;
        if (tags) query.tags = tags;
        let data = await blogModel.find(query);
        let size = data.length
        if (size < 1) return res.status(404).send({ status: false, msg: "No Blogs found" })
        return res.status(200).send({ status: true, msg: data })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}
module.exports = {createBlog ,getBlog ,filterBlogsDetails}
