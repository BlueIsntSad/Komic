const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Section", sectionSchema, "sections");
