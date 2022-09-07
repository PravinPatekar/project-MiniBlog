const authorModel = require("../model/authorModel")
const jwt = require('jsonwebtoken')
const createAuthor = async function (req, res) {
    try {
        let data = req.body
        let saveData = await authorModel.create(data)
        res.status(200).send({ msg: saveData })
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

const login = async function (req, res) {

    try {
        const data = req.body;

        if (!data.email) { return res.status(400).send({ status: false, msg: "Email is mandatory" }) }

        if (!data.password) { return res.status(400).send({ status: false, msg: "Password is mandatory" }) }

        const user = await authorModel.findOne({ email: data.email });

        if (!user) { return res.status(404).send({ status: false, msg: "User not found" }) }

        if (user.password != data.password) { return res.status(404).send({ status: false, msg: "Plz enter correct password" }) }

        const token = jwt.sign({ email: user.email, password: user.password, authorId: user["_id"]}, "project-blog team 67")

        return res.status(200).send({ status: true, msg: token })
    }
    catch (err) {
        return res.status(500).send({ status: true, msg: err.message })
    }
}

module.exports = { createAuthor, login }