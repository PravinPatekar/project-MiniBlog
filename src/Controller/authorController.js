const authorModel = require("../models/authorModel")
const {isValid,} = require("../middleware/validation")

const createAuthor = async function (req, res) {
    let Author = req.body
    let { fname, lname, title, email, password } = Author

    if (!isValid(fname)) {
        return res.status(400).send({ msg: "Enter First Name" })
    } 

    if (!isValid(lname)) {
        return res.status(400).send({ msg: "Enter Last Name" })
    }

    if (!isValid(title)) {
        return res.status(400).send({ msg: "Enter Title" })
    }

    let authorCreated = await authorModel.create(Author)
    res.send({ data: authorCreated })
}




module.exports = createAuthor

