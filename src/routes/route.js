const express = require("express");
const router = express.Router();
const authorController = require("../Controller/authorController")
const blogController = require("../Controller/blogController")
const middleware = require("../Middleware/validation")


router.post("/authors", authorController.createAuthor);
router.post("/createBlog", blogController.createBlog);

router.get("/getBlog",middleware.validation,middleware.authorise, blogController.blogsDetails);
router.put("/blogs/:blogId", blogController.updateBlog);
router.delete("/blogs/:blogId", blogController.deleteBlogByParams)
router.delete("/blogs", blogController.deleteBlogByQuery)
router.post("/login", authorController.login);



module.exports = router;