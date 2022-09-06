const authorModel = require("../model/authorModel");

const createAuthor = async function (req, res) {
  try {
    let Author = req.body;
    let fname = req.body.fname;
    if (!fname) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter First name" });
    }

    let lname = req.body.lname;
    if (!lname) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter Last name" });
    }

    let title = req.body.title;
    if (!title) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter Last title" });
    }

    let email = req.body.email;
    let emailCheck = await authorModel.findOne({ email });

    if (emailCheck) {
      return res.status(400).send({
        status: false,
        msg: `${email} email address is already registered`,
      });
    }
    if (!email) {
      return res.status(400).send({ status: false, msg: "please enter email" });
    }

    let password = req.body.password;
    if (!password) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter password" });
    }

    const regex = /^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).([a-z]+)$/; //using regex we will verify the email is valid or not
    if (regex.test(email)) {
      let authorCreated = await authorModel.create(Author);
      res.status(201).send({ data: authorCreated });
    }
    else {
        res.status(400).send({ msg: "Enter Vaild Email" })
    }
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.createAuthor = createAuthor;
