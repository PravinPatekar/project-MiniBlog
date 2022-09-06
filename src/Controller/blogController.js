const authorModel = require("../model/authorModel");
const blogModel = require("../model/blogModel");
const moment =  require("moment")
const createBlog = async function (req, res) {
  try {
    let blog = req.body;
    let title = req.body.title;
    let authorId = req.body.authorId;
    let body = req.body.body;
    let category = req.body.category;

    if (!title) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter the title" });
    }
    if (!body) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter the body" });
    }
    if (!authorId) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter the autherid" });
    }

    if (!category) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter the category" });
    }

    let author = await authorModel.findById({ _id: authorId });

    if (author.length != 0) {
      let blogCreated = await blogModel.create(blog);
      res.send({ data: blogCreated });
    }
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};
module.exports.createBlog = createBlog;

// get blog
const getBlog = async function (req, res) {
  try {
    let filter = req.query;
    let fsize = Object.entries(filter).length;
    if (fsize < 1) {
      try {
        let data = await blogModel.find({
          isPublished: true,
          isDeleted: false,
        });
        if (!data)
          return res.status(404).send({ status: false, msg: "No Blogs found" });
        return res.status(200).send({ status: true, msg: data });
      } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
      }
    }
    let data = await blogModel.find(filter);
    let size = data.length;
    if (size < 1)
      return res.status(404).send({ status: false, msg: "No Blogs found" });
    return res.status(200).send({ status: true, msg: data });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};
module.exports.getBlog = getBlog;
// update blog
const updateBlog = async function (req, res) {
    try {
        const { title, body, tags, subcategory } = req.body;
        const blogId = req.params.blogId;

        if (!blogId) { return res.status(400).send({ status: false, msg: "Plz enter blogID" }) }

        const isValidBlog = await blogModel.findById(blogId);
        if (!isValidBlog) { return res.status(404).send({ status: false, msg: "Blog not found" }) }

        if (isValidBlog.isDeleted == true) { return res.status(404).send({ status: false, msg: "Blog Already Deleted" }) }

        const update_Blog = await blogModel.findOneAndUpdate(
            {_id :blogId},
            {
                $set: { title, body, isPublished: true, publishedAt: moment().format() },
                $push: { tags, subcategory },
            },
            { new: true }
        )
        return res.status(200).send({ status: true, msg: update_Blog })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}
module.exports.updateBlog=updateBlog

// delete blog
const deletedBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    if (!blogId) {
      res.status(400).send({
        status: false,
        msg: "Please enter blog Id",
      });
    }
    let data = await blogModel.findById(blogId);

    if (data.isDeleted != false) {
      res.status(404).send({
        status: false,
        msg: "document does not exist",
      });
    }

    if (data.isDeleted == false) {
      let deleted = await blogModel.findOneAndUpdate(
        { _id: blogId },
        { isDeleted: true, deleteAt: Date() },
        { new: true }
      );
      return res.status(200).send({
        status: true,
        msg: deleted,
      });
    }
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};
module.exports.deletedBlog = deletedBlog;


const deletedBlogByParams = async function (req, res){
    let query = req.query;



}
