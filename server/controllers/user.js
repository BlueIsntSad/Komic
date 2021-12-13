const { User, Admin, Comment } = require('../models/user');
const Manga = require('../models/manga');
const Chapter = require('../models/chapter');


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
        let userId = req.params.uid;

        let user = await User.findById(userId, 'name library -_id')
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
            collection: user.library.collections.collect
        });
    } catch (err) { console.log(err.message) }
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

module.exports = { getUserProfile, getUserLibrary, add };