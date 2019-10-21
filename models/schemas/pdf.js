const mongoose = require('mongoose')
const { Schema, SchemaTypes: { ObjectId } } = mongoose

const pdf = new Schema({
    title:{
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    file_url:{
        type: String,
        required: true 
    }
})

module.exports = pdf