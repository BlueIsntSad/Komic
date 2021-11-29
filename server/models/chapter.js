const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chapterSchema = new Schema({
    name: {
        type: String, 
        required: true,
        default: "No Name"
    },
    sections: {
        type: [{type: Schema.Types.ObjectId, ref: 'Section'}],
        required: true,
        default: []
    }
})

module.exports = mongoose.model('Chapter', chapterSchema, 'chapters');