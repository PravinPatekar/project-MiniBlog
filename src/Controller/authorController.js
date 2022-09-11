const authorModel = require("../model/authorModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const isValid = function(value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

//create author api
const createAuthor = async function(req, res) {
    try {
        let data = req.body;
        if (Object.entries(data).length == 0) {
            return res.status(400).send({
                status: false,
                msg: "data should be provided",
            });
        }
        if (isValid(data.fname) == false) {
            return res.status(400).send({
                status: false,
                msg: "fname is required"
            });
        }
        if (isValid(data.lname) == false) {
            return res.status(400).send({
                status: false,
                msg: "lname is required"
            });
        }

        let isValidFname = validator.isAlpha(data.fname);
        let isValidLname = validator.isAlpha(data.lname);
        if (isValidFname == false || isValidLname == false) {
            return res.status(400).send({
                status: false,
                msg: "First Name & Last Name Should contain only alphabets",
            });
        }
        if (isValid(data.title) == false) {
            return res.status(400).send({
                status: false,
                msg: "title is required"
            });
        }

        const titleEx= ["Mr", "Mrs", "Miss"];
        const isValidTitle = titleEx.includes(data.title);
        if( isValidTitle== false){
          return res.status(400).send({
            status: false,
            msg: "enter valid title like -> Mr , Mrs ,Miss"
        });
        }
        if (isValid(data.email) == false) {
            return res.status(400).send({
                status: false,
                msg: "email is required"
            });
        }
        if (isValid(data.password) == false) {
            return res.status(400).send({
                status: false,
                msg: "passord is required"
            });
        }

        let isValidEmail = validator.isEmail(data.email);


        if (isValidEmail) {
            const isPresent = await authorModel.findOne({
                email: data.email
            })
            if (isPresent) {
                return res.status(400).send({
                    status: false,
                    msg: "author is already present with this email id"
                })
            } else {
                let saveData = await authorModel.create(data);
                res.status(201).send({
                    status: true,
                    msg: saveData,
                });
            }
        } else {
            return res.status(400).send({
                status: false,
                msg: "plz enter valid email",
            });
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({
            msg: err.message,
        });
    }
};

///login api//
const login = async function(req, res) {
    try {
        const data = req.body;

        if (isValid(data.email) == false) {
            return res.status(400).send({
                status: false,
                msg: "email is required"
            });
        }
        if (isValid(data.password) == false) {
            return res.status(400).send({
                status: false,
                msg: "passord is required"
            });
        }

        let isValidEmail = validator.isEmail(data.email);
        if (isValidEmail == false) {
            return res.status(400).send({
                status: false,
                msg: "plz enter valid email",
            });
        }
        const user = await authorModel.findOne({
            email: data.email,
        });

        if (!user) {
            return res.status(404).send({
                status: false,
                msg: "author not found",
            });
        }

        if (user.password != data.password) {
            return res.status(404).send({
                status: false,
                msg: "Plz enter correct password",
            });
        }

        const token = jwt.sign({
                email: user.email,
                password: user.password,
                authorId: user["_id"],
            },
            "project-blog group 33"
        );

        return res.status(200).send({
            status: true,
            msg: {
                token: token
            },
        });
    } catch (err) {
        return res.status(500).send({
            status: true,
            msg: err.message,
        });
    }
};

module.exports = {
    createAuthor,
    login,
    isValid
};