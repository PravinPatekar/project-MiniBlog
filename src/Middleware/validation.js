const jwt = require("jsonwebtoken");

const validation = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(400)
        .send({ status: false, msg: "token must be present" });
    }

    let decodeToken = jwt.verify(token, "functionUp")
    req.token = decodeToken
    next();
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message })
  }

};

const authorise = function (req, res, next) {
  let author_id = req.query.authorId
  let bodyId = req.token.authorId
  if (author_id !== bodyId) return res.status(401).send({ status: false, msg: "Permission denied" })
  next()
}

module.exports = { validation, authorise }


