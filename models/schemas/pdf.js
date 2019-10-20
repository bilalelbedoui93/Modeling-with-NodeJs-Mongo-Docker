const mongoose = require('mongoose')
const { Schema, SchemaTypes: { ObjectId } } = mongoose

const pdf = new Schema({

    author: {
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    file_url:{
        type: String,
        required: true 
    },
    rating: {
        type: Number,
        required: true,
    }
})

module.exports = pdf