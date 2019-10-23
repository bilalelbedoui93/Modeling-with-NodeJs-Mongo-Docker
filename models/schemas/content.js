const mongoose = require('mongoose')
const { Schema, SchemaTypes: { ObjectId } } = mongoose

const video = require('./video')
const pdf = require('./pdf')
const text = require('./text')


const content = new Schema({
    type:{
        type: String,
        enum:['video','pdf','text'],
        required: true,
    },
    /*
    item:{
        type: function(){
            if(this.type ==='video') return video
            if(this.type ==='pdf') return pdf
            if(this.type ==='text') return text

        }
    },
    */
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
    },
    rating: {
        type: Array,
    }
})

module.exports = content




