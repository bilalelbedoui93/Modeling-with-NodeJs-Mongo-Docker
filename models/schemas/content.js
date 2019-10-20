const mongoose = require('mongoose')
const { Schema, SchemaTypes: { ObjectId } } = mongoose

const video = require('./video')
const pdf = require('./pdf')
const text = require('./text')


const content = new Schema({

    type: {
        type: String,
        required: true,
        enum: ['video', 'pdf', 'text']
    },
    video: {
        type: video
    },
    pdf: {
        type: pdf
    },
    text: {
        type: text
    }
})

module.exports = content




