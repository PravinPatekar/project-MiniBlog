const express=require('express');
const router=express.Router();
const authorController=require('../controller/authorController')
const blogController=require('../controller/blogController')
// const middleWare = require("../Middleware/middleWare")

// APIs
router.post('/authors', authorController.createAuthor)  

router.post("/blogs",  blogController.createBlog)

router.post("/login", authorController.authorLogin) 

router.get("/blogs",   blogController.getBlogs)  

router.put("/blogs/:blogId",  blogController.updateBlogs)

router.delete("/blogs/:blogId", blogController.deleteByBlogId) 

router.delete("/blogs", blogController.deleteByQueryParams)  
 

module.exports = router;