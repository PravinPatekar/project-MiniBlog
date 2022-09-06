const jwt = require("jsonwebtoken");

//
const authentication = function(req, res, next){
    
    try{
        let token = req.headers["x-Api-Key"];
        if (!token) token = req.headers["x-api-key"];

        if (!token) return res.status(401).send({ status: false, msg: "token must be present" });

        let decodedToken= jwt.verify(token, "Hera-pheri");
        if (!decodedToken) return res.status(401).send({ status: false, msg: "token is invalid" });
        
        req.headers["authorId"] = decodedToken.authorId 

        next()
    } catch (error) {
        console.log(error);
        res.status(500).send({ err : error.message });
    }
}

module.exports={authentication}