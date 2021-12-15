const { User, Admin, Comment } = require('../models/user');
const Manga = require('../models/manga');
const Chapter = require('../models/chapter');
const ObjectId = require('mongodb').ObjectID;


async function getUserProfile(req, res, next) {
    let userId = req.params.uid;
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

async function getUserLibrary(req, res, next) {
    try {
        const tab = req.query.tab || 'history';
        const userId = req.params.uid;

        const user = await User.findById(userId, 'name library -_id')
            .populate('library.history.mangaCollect.manga',
                'cover slug title views follower finished description -_id')
            .populate('library.collections.collect.mangaCollect.manga',
                'cover slug title views follower finished description -_id')
            .lean()
        user.library.history.mangaCollect.sort(function (a, b) {
            return ((a.lastRead == b.lastRead) ? 0 : ((a.lastRead < b.lastRead) ? 1 : -1));
        })

        //res.send(user.library.collections.collect)
        res.render('storage', {
            title: `Library | Komic`,
            script: ['storage'],
            history: user.library.history.mangaCollect,
            collection: user.library.collections.collect,
            userId: userId,
            tab: tab
        });
    } catch (err) { console.log(err.message) }
}

async function getCollection(req, res, next) {
    try {
        const userId = req.params.uid;
        let user = await User.findById(userId, 'name library -_id')
            .populate('library.collections.collect.mangaCollect.manga',
                'cover slug title views follower finished description -_id')
            .lean()
        let collectList = user.library.collections.collect
        let collectQuery = req.query.title
        let collect = collectList.find(collect => collect.title === collectQuery)
        //console.log('title:',collect.title);
        //res.send(collect)
        res.render('collection', {
            title: `Library | Komic`,
            script: ['storage'],
            collection: collect,
            userId: userId
        });
    } catch (err) { console.log(err.message) }
}

async function editCollection(req, res, next) {
    await User.findById(req.params.uid, function (err, result) {
        if (!err) {
            if (!result) {
                res.status(404).send('User was not found');
            }
            else {
                let collectQuery = req.params.cid;
                result.library.collections.collect.id(collectQuery).title = req.body.title;
                result.markModified('library.collections.collect');
                result.save(function (saveerr, saveresult) {
                    if (!saveerr) {
                        res.status(200).send(saveresult);
                    } else {
                        res.status(400).send(saveerr.message);
                    }
                });
            }
        } else { res.status(404).send(err.message); }
    })
}

/* async function getHistory(userId) {
    const histories = await User.findById(userId, 'name library -_id')
        .populate({
            path: 'library.history.mangaCollect.manga',
            select: 'cover slug title views follower finished description -_id'
        })
        .lean()
    histories.library.history.mangaCollect.sort(function (a, b) {
        return ((a.lastRead == b.lastRead) ? 0 : ((a.lastRead < b.lastRead) ? 1 : -1));
    })
    return histories.library.history.mangaCollect
}*/

function add(req, res) { }

module.exports = { getUserProfile, getUserLibrary, add, getCollection, editCollection };