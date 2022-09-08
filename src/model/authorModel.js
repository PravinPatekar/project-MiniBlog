const mongoose = require('mongoose')
const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        match: [/^a-z$/i,
            "Please enter Vaild name(use only alphabtes)"]
    },
    lname: {
        type: String,
        required: true,
        match: [/^a-z$/i,
            "Please enter Vaild name(use only alphabtes)"]
    },
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, ///regex///
            "Please fill a valid email address"
        ]
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('project1_Author', authorSchema)