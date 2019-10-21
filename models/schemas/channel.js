const mongoose = require('mongoose')
const { Schema, Types: { ObjectId } } = mongoose

const content = require('./content')
const subchannel = require('./subchannel')


const channel = new Schema({
    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'groups',
    }],
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true,
    },
    language: {
        type: String,
        required: true,
        trim: true
    },
    picture: {
        type: String,
        required: true,
    },
    has_subchannels: {
        type: Boolean,
        default: false,
        required: true
    },
    subchannels: {
        type: [subchannel]
        //required: function () { this.has_subchannels == true ? true : false }
    },
    content: {
        type: [content],
        //required: function () { this.has_subchannels == false ? true : false }
    }
},
    {
        minimize: false
    })

module.exports = channel































