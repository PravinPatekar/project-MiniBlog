const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

// Validation
const isValid = function(value){
  if(typeof value === "undefined" || value === null ) return false
  if(typeof value === "string" || value.trim().length === 0 ) return false
  return true
}

const isValidTitle = function(title){
  return ["Mr", "Ms", "Miss"].indexOf(title) !== -1
}

const isValidRequestBody = function(requestBody){
  return Object.keys(requestBody).length > 0
}

const createAuthor = async function (req, res) {
  try {
    let data = req.body;
    if (!isValidRequestBody(data)) return res.status(400).send({status:false, msg: "Body should not be empty" })
    
    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email)) return res.status(400).send({ status:false,  message: "Please Enter Email in valid Format" })

    if(!("fname" in data) || !("lname" in data) || !("title" in data) || !("email" in data) || !("password" in data) ) return res.status(400).send({status:false, msg:"fname, lname, title, email, password are required"})

    if(isValid(data.fname)) return res.status(400).send({status:false, msg:"Please Enter First Name"})

    if(isValid(data.lname)) return res.status(400).send({status:false, msg:"Please Enter Last Name"})
    
    if(isValid(data.title)) return res.status(400).send({status:false, msg:"Please Enter Title"})

    if(isValid(data.password)) return res.status(400).send({status:false, msg:"Please Enter Password"})

    const isEmailUsed = await authorModel.findOne({email: data.email})

    if(isEmailUsed){
      res.status(400).send({status: false, msg: `${data.email} this email is already been used.`})
      return
    }

    let savedData = await authorModel.create(data);
    res.status(201).send({ status: true, data: savedData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ err : error.message });
  }
};

const authorLogin=async function (req, res){
  try{
    let requestBody = req.body
    if(!isValidRequestBody(requestBody)){
      res.status(400).send({status: false, msg: "Please Provide Login Details"})
      return
    }

    if(isValid(requestBody.email)){
      res.status(400).send({status: false, msg: "Email is required"})
      return
    }
    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(requestBody.email)) return res.status(400).send({ status:false, message: "Please Enter Email in valid Format" })

    if(isValid(requestBody.password)){
      res.status(400).send({status: false, msg: "Password is required"})
      return
    }

    let author=await authorModel.findOne({email:requestBody.email, password:requestBody.password});
    if(!author)
    return res.status(401).send({status:false, msg:"email or password doesn't match"})

    let token = jwt.sign(
      {
        authorId: author._id.toString(),
      },
      "Hera-pheri"
    );
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, token: token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ err : error.message });
  }
};

module.exports = {createAuthor, authorLogin};