const mongoose = require('mongoose')
const { Schema } = mongoose

const group = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required: true,
        trim: true,
    }
})

module.exports = group