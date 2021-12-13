const { User, Admin, Comment } = require('../models/user');
const Manga = require('../models/manga');
const Chapter = require('../models/chapter');


async function getUserProfile(req, res) {
    var userId = req.params.uid;
    await User.findById(userId)
        .lean()
        .populate('library.history.mangaCollect.manga',
            'cover slug title views follower finished')
        .populate('library.collections.collect.mangaCollect.manga',
            'cover slug title views follower finished')
        .then(userDoc => {
            res.render('profile', {
                user: userDoc,
                title: `${userDoc.name} | Komic`,
                script: ['profile'],
                history: userDoc.library.history.mangaCollect,
                collections: userDoc.library.collections.collect
            });
        })
        .catch(function (err) { console.log(err.message) });
}

async function getUserLibrary(req, res) {
    let userId = req.params.uid;
    let limit = 5;
    let page = req.query.page || 1;

    const histories_ = await getHistory(userId, limit, page);

    res.send(histories_)
    /* await User.findById(userId)
        .lean()
        .populate('library.history.mangaCollect.manga',
            'cover slug title views follower finished description')
        .then(userDoc => {
            res.render('storage', {
                user: userDoc,
                title: `${userDoc.name} - Library | Komic`,
                script: ['storage'],
                history: userDoc.library.history.mangaCollect
            });
        })
        .catch(function (err) { console.log(err.message) }); */
}

async function getHistory(userId, limit, page) {
    const histories = await User.findById(userId, 'library -_id')
        .populate({
            path: 'library.history.mangaCollect.manga',
            options: { limit: 5, skip: 0 },
            select: 'cover slug title description -_id'
        })
        .lean()
    return histories.library.history;
}

function add(req, res) { }

module.exports = { getUserProfile, getUserLibrary, add };