const mongoose = require('mongoose')
const { Schema, SchemaTypes: { ObjectId } } = mongoose

const content = require('./content')

const subchannel = new Schema({

    title: {
        type: String,
        required: true,
        trim: true,
    },
    language: {
        type: String,
        required:true,
        trim: true
    },
    picture: {
        type: String,
        required: true,
    },
    content:{
        type: [content],
    }
})

module.exports = subchannel