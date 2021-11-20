const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: String,
    account: String,
    password: String
})

const userSchema = new Schema({
    name: {type: String, required: true, default: 'Newbie'},
    account: {type: String, required: true},
    avatar: {type: String, default: 'img/avatar_default.png'},
    cover: {type: String, default: 'img/avatar_default.png'},
    about: {type: String, default: ''},
    adress: {type: String, default: ''},
    joinDay: {type: Date, default: Date.now},
    follower: {type: Number, default: 0},
    views: {type: Number, default: 0}
},{timestamps: true});

const userS = mongoose.model('User', userSchema);
const adminS = mongoose.model('Admin', adminSchema);

module.exports = { User: userS, Admin: adminS };