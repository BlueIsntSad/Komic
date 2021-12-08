const { User, Admin, Comment } = require('../models/user');
const Manga = require('../models/manga');
const Chapter = require('../models/chapter');

function index(req, res) {
    res.render('profile', {
        title: 'User guy | Komic',
        user: '/img/avatar_default.png'
    })
}

async function getUserProfile(req, res) {
    var userId = req.params.uid;
    await User.findById(userId)
        .lean()
        .populate('library.history.mangaCollect.manga')
        .populate('library.collections.collect.mangaCollect.manga')
        .then(userDoc => {
            res.render('profile', {
                user: userDoc,
                title: `${userDoc.name} | Komic`,
                script: 'profile',
                history: userDoc.library.history.mangaCollect,
                collections: userDoc.library.collections.collect
            });
        })
        .catch(function (err) { console.log(err) });
}

async function getUserStorage(req, res) {
    var userId = req.params.uid;
    await User.findById(userId)
        .lean()
        .populate('library.history.mangaCollect.manga')
        .populate('library.collections.collect.mangaCollect.manga')
        .then(userDoc => {
            res.render('storage', {
                user: userDoc,
                title: `${userDoc.name} - Library | Komic`,
                script: 'profile',
                history: userDoc.library.history.mangaCollect,
                collections: userDoc.library.collections.collect
            });
        })
        .catch(function (err) { console.log(err) });
}

function add(req, res) {}

module.exports = { index, getUserProfile, getUserStorage, add };