const mongoose = require('mongoose')
const { Schema, SchemaTypes: { ObjectId } } = mongoose

const text = new Schema({
    title:{
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    text_body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    rating: {
        type: Array,
        required: true,
    }
})

module.exports = text