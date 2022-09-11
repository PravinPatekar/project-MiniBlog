const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel")

//////Authenticate//////

const authenticate = function(req, res, next) {
    try {
        let token = req.headers[`x-api-key`];

        if (!token)
            return res
                .status(404)
                .send({
                    status: false,
                    msg: "token must be present"
                });

        let decodedToken = jwt.verify(
            token,
            "project-blog group 33",
            function(err, decode) {
                if (err) {
                    return res.send("invalid");
                }
                return decode;
            }
        );
        req.token = decodedToken;
        next();
    } catch (error) {
        return res.status(500).send({
            status: false,
            msg: error.message
        });
    }
};

/////Authorization/////

const authorise = async function(req, res, next) {

    let getBlogByParam = req.params.blogId;
    if (!getBlogByParam) {
        return res.status(400).send({
            status: false,
            msg: "provide blogId"
        });
    }
    let getBlogId = await blogModel.findById(getBlogByParam);
    if (!getBlogId) {
        return res.status(404).send({
            status: false,
            msg: "Invalid blogId"
        });
    }
    if (getBlogId.authorId != req.token.authorId) {
        return res.status(403).send({
            status: false,
            msg: "Permission denied"
        });
    }
    next();
};



const authorise2 = async function(req, res, next) {

    let getBlogByQuery = req.query;
    if (Object.keys(getBlogByQuery).length == 0) {
        return res.status(400).send({
            status: false,
            msg: "data should be provided"
        });
    }
    let allAuthorId= await blogModel.find(getBlogByQuery).select({authorId:1,_id:0 })
    let filterAuthorId= allAuthorId.filter(index => index.authorId==req.token.authorId)
  
    
    if (filterAuthorId.length <1) {
        return res.status(400).send({
            status: false,
            msg: "Permission Denied"
        })
    }
    next();
}

module.exports = {
    authenticate,
    authorise,
    authorise2
};