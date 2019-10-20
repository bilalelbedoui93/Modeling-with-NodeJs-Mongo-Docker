const mongoose = require('mongoose')
const { Schema } = mongoose

const group = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true,
    }
})

module.exports = group