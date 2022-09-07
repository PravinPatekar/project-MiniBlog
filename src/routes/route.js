const express = require("express");
const router = express.Router();
const authorController = require("../Controller/authorController")
const blogController = require("../Controller/blogController")



router.post("/authors", authorController.createAuthor);
router.post("/createBlog", blogController.createBlog);
router.get("/getBlog", blogController.blogsDetails);
router.put("/blogs/:blogId", blogController.updateBlog);
router.delete("/blogs/:blogId", blogController.deleteBlogByParams)
router.delete("/blogs", blogController.deleteBlogByQuery)



module.exports = router;