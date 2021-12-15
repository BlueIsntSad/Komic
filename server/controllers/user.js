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
        const tab = req.query.tab || 'history';
        const userId = req.params.uid;

        const user = await User.findById(userId, 'name library -_id')
            .populate('library.history.mangaCollect.manga',
                'cover slug title views follower finished description')
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
        let user = await User.findById(userId, 'name library')
            .populate('library.collections.collect.mangaCollect.manga',
                'cover slug title views follower finished description')
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

async function editCollectionItem(req, res, next) {
    const userId = req.params.uid
    console.log(userId)
    const collectId = req.params.cid
    console.log(collectId)
    const mangaId = req.params.mid
    console.log(mangaId)

    await User.updateOne({ _id: userId, 'library.collections.collect._id':collectId }, {
        $pull: {
            "library.collections.collect.mangaCollect": { manga: mangaId }
        }
    }).then(result => {
        res.json(result) //{ success: true, message: "Cập nhật thông tin truyện thành công!", newManga: result }
    }).catch(function (err) {
        console.log(err.message)
        res.json(result) //{ success: false, message: "Xoá lịch sử không thành công!"}
    });
}

async function deleteHistory(req, res, next) {
    const userId = req.params.uid
    const hisId = req.params.hid
    await User.updateOne({ _id: userId }, {
        $pull: {
            "library.history.mangaCollect": { manga: hisId }
        }
    }).then(result => {
        res.json(result) //{ success: true, message: "Cập nhật thông tin truyện thành công!", newManga: result }
    }).catch(function (err) {
        console.log(err.message)
        res.json(result) //{ success: false, message: "Xoá lịch sử không thành công!"}
    });
}

async function deleteCollection(req, res, next) {
    const userId = req.params.uid
    const collectId = req.params.cid
    await User.updateOne({ _id: userId }, {
        $pull: {
            "library.collections.collect": { _id: collectId }
        }
    }).then(result => {
        res.json(result) //{ success: true, message: "Cập nhật thông tin truyện thành công!", newManga: result }
    }).catch(function (err) {
        console.log(err.message)
        res.json(result) //{ success: false, message: "Xoá lịch sử không thành công!"}
    });
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

module.exports = {
    getUserProfile, getUserLibrary,
    getCollection, editCollectionItem, deleteCollection,
    deleteHistory
};