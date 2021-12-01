const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mangaSchema = new Schema({
    cover:{
        type: String,
        required: true,
    },
    title: {
        type: String, 
        required: true, 
        default: 'No Name'
    },
    title_org: {
        type: String,  
        default: ''
    },
    description: {
        type: String, 
        required: true, 
        default: 'No Type'
    },
    author: {
        type: String, 
        default: 'No author',
    },
    translator: {
        type: String, 
        default: 'No translator',
    },
    status: {
        type: String, 
        default: 'Unknown',
        required: true
    },
    releaseDay: {
        type: Date, 
        default: Date.now,
    },
    follower: {
        type: Number,
        default: 0
    },
    views: {
        type: Number, 
        default: 0
    },
    categories: {
        type: [{type: Schema.Types.ObjectId, ref: 'Category'}],
        default: []
    },
    chapters: {
        type: [{type: Schema.Types.ObjectId, ref: 'Chapter'}],
        required: true,
        default: []
    },
    total: {
        type: Number,
        default: 0
    },
    finished: {
        type: Number,
        default: 0
    },
    rate: {
        type: Number,
        default: 0
    },
    totalRate: {
        type: Number,
        default: 0
    }

},{ timestamps: true});


module.exports = mongoose.model('Manga', mangaSchema, "mangas");