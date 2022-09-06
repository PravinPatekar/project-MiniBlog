const express = require("express");
const router = express.Router();
const authorController = require("../Controller/authorController")
const blogController = require("../Controller/blogController")



router.post("/authors", authorController.createAuthor);
router.post("/createBlog", blogController.createBlog);
router.get("/getBlog", blogController.getBlog);


router.put("/delete/:blogId", blogController.deletedBlog);
router.put("/updateBlog/:blogId", blogController.updateBlog)



module.exports = router;