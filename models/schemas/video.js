const mongoose = require('mongoose')
const { Schema, SchemaTypes: { ObjectId } } = mongoose

const video = new Schema({

    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    movie_director: {
        type: String,
        required: true
    },
    genre: {
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
    file_url: {
        type: String,
        required: true
    },
    rating: {
        type: Array,
    }
})

module.exports = video