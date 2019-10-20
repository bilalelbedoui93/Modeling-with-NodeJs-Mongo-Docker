const mongoose = require('mongoose')
const { Schema, SchemaTypes: { ObjectId } } = mongoose

const video = new Schema({

    author: {
        type: String,
        required: true
    },
    movie_director:{
        type: String,
        required: true
    },
    genre:{
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

module.exports = video