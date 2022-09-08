const blogModel = require("../model/blogModel");
const authorModel = require("../model/authorModel");

const createBlog = async function (req, res) {
  try {
    const blog = req.body;
    const authorId = blog.authorId;

    if (!authorId) {
      return res.send({ status: false, msg: "Plz enter author id" });
    }
    const isValidAuthor = await authorModel.findById(authorId);
    if (!isValidAuthor) {
      return res.send({ status: false, msg: "Author dosen't exist" });
    }
    if (blog.isPublished == true) {
      blog.publishedAt = moment();
    }
    const saveBlog = await blogModel.create(blog);
    return res.status(201).send({
      status: true,
      data: saveBlog,
    });
  } catch (err) {
    return res.status(400).send({
      status: false,
      msg: err.message,
    });
  }
};

const blogsDetails = async function (req, res) {
  try {
    let filter = req.query;
    let fsize = Object.entries(filter).length;
    if (fsize < 1) {
      let data = await blogModel.find({
        isPublished: true, //true
        isDeleted: false, ///false
      });
    
      if (data.length == 0)
        return res.status(404).send({ status: false, msg: "No Blogs found" });
      return res.status(200).send({ status: true, msg: data });
    }
    filter.isDeleted=false;
    filter.isPublished=true;
    let data = await blogModel.find(filter);
    if (data.length == 0) {
      return res.status(404).send({ status: false, msg: "No Blogs found" });
    }
    return res.status(200).send({ status: true, msg: data });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const updateBlog = async function (req, res) {
  try {
    const { title, body, tags, subcategory } = req.body;
    const blogId = req.params.blogId;

    // if (!blogId) {
    //   return res.status(400).send({ status: false, msg: "Plz enter blogID" });
    // }

    const isValidBlog = await blogModel.findById(blogId);
    // if (!isValidBlog) {
    //   return res.status(404).send({ status: false, msg: "Blog not found" });
    // }

    if (isValidBlog.isDeleted == true) {
      return res
        .status(404)
        .send({ status: false, msg: "Blog Already Deleted" });
    }

    if (isValidBlog.isPublished == true) {
      return res
        .status(404)
        .send({ status: false, msg: "Blog is already published" });
    }

    const update_Blog = await blogModel.findOneAndUpdate(
      { _id: blogId },
      {
        $set: {
          title,
          body,
          isPublished: true,
          publishedAt: Date(),
        }, ///can also use moment
        $push: { tags, subcategory },
      },
      { new: true }
    );
    return res.status(200).send({ status: true, msg: update_Blog });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const deleteBlogByParams = async function (req, res) {
  try {
    let blogId = req.params.blogId;

    if (!blogId) {
      return res.status(404).send({ status: false, msg: "Plz enter blog id" });
    }

    let checkBlogId = await blogModel.findById(blogId);

    if (!checkBlogId) {
      return res.status(404).send({ status: false, msg: "Blog doesn't exist" });
    }
    if (checkBlogId.isDeleted == true) {
      return res
        .status(404)
        .send({ status: false, msg: "Blog already deleted" });
    }
    if (checkBlogId.isPublished == true) {
      return res
        .status(404)
        .send({ status: false, msg: "Blog already published" });
    }
    let updatedId = await blogModel.updateOne(
      { _id: blogId },
      { $set: { isDeleted: true, deletedAt: Date() } }, ///Date shows indian time format
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, msg: "Blog Deleted Succesfully" });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

const deleteBlogByQuery = async function (req, res) {
  try {
    let data = req.query;
    let size = Object.entries(data).length;

    if (size < 1) {
      return res
        .status(400)
        .send({ status: false, msg: "Query params not given" });
    }
    data.isDeleted = false
    data.isPublished = false

    let deletedBlog = await blogModel.updateMany(data, {
      isDeleted: true,
      deletedAt: Date(),
    });
    if(deletedBlog.modifiedCount==0){
      return res.status(404).send({status:false, msg:"blogs are already deleted"})
    }
    return res
      .status(200)
      .send({ status: true, msg: "Blog Deleted Succesfully" });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = {
  createBlog,
  blogsDetails,
  updateBlog,
  deleteBlogByParams,
  deleteBlogByQuery,
};