const mongoose = require('mongoose')
const { Schema, SchemaTypes: { ObjectId } } = mongoose

const video = require('./video')
const pdf = require('./pdf')
const text = require('./text')


const content = new Schema({
    type:{
        type: String,
        required: true
    },
    video: {
        type: video,
        required: function () { this.type === 'video' ? true : false }
    },
    pdf: {
        type: pdf,
        required: function () { this.type === 'pdf' ? true : false }
    },
    text: {
        type: text,
        required: function () { this.type === 'text' ? true : false }
    }
})

module.exports = content




