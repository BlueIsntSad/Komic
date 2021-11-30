const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chapterSchema = new Schema({
    index: {
        type: String, 
        required: true
    },
    name: {
        type: String,
        default: ""
    },
    views: {
        type: Number,
        default: 0
    },
    sections: {
        type: [{type: Schema.Types.ObjectId, ref: 'Section'}],
        required: true,
        default: []
    }
}, { timestamps: true })

module.exports = mongoose.model('Chapter', chapterSchema, 'chapters');