const authorModel=require("../models/authorModel")


const createAuthor= async function (req,res){
    let Author = req.body
    let authorCreated = await authorModel.create(Author)
    res.send({data: authorCreated})
}     




module.exports.createAuthor= createAuthor

