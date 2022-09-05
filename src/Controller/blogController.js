const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const router = require("../routes/route")

const createBlog = async function (req, res) {
    let blog = req.body;
    let blogCreated = await blogModel.create(blog)
    res.send({ data: blogCreated })
}

const getBlog = async function (req, res) {
    let blogs = await blogModel.find().populate('authorId')
    res.send({ data: blogs })

}
module.exports.createBlog = createBlog
module.exports.getBlog = getBlog