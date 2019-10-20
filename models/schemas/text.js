const mongoose = require('mongoose')
const { Schema, SchemaTypes: { ObjectId } } = mongoose

const text = new Schema({

    author: {
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    text_body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    }
})

module.exports = text