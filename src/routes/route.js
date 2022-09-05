const express = require("express");
const router = express.Router();
const createAuthor = require("../Controller/authorController")
const {createBlog ,getBlog ,filterBlogsDetails} = require("../Controller/blogController")



router.post("/createAuthor", createAuthor);
router.post("/createBlog", createBlog);
router.get("/getBlog", getBlog);
router.get("/filterBlogsDetails",filterBlogsDetails)


module.exports = router;