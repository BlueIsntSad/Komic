const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    avatar: {type: String, default: 'No Name'},
    description: {type: String, required: true, default: 'No Type'},
    author: {type: String, default: 'No author'},
    releaseDay: {type: Date, default: Date.now},
    status: {type: String, default: 'Unknown'},
    translator: {type: String, default: 'No translator'},
    follower: {type: Number, default: 0},
    views: {type: Number, default: 0}
},{ timestamps: true});

module.exports = mongoose.model('user', userSchema);