const express = require("express");
const router = express.Router();
const authorController = require("../controller/authorController")
const blogController= require('../controller/blogController')
const middleware= require("../middleware/auth")



router.post("/authors", authorController.createAuthor)

router.post("/login", authorController.login)

router.post("/blogs",middleware.authenticate, blogController.createBlog)

router.get("/blogs",middleware.authenticate, blogController.blogsDetails)

router.put("/blogs/:blogId",middleware.authenticate, middleware.authorise, blogController.updateBlog)

router.delete("/blogs/:blogId", middleware.authenticate, middleware.authorise, blogController.deleteBlogByParams)

router.delete("/blogs", middleware.authenticate, middleware.authorise2, blogController.deleteBlogByQuery)



module.exports = router;