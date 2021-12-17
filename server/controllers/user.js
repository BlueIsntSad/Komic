const { User, Admin, Comment } = require('../models/user');
const Manga = require('../models/manga');
const Chapter = require('../models/chapter');
const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');
const { ObjectId } = require('mongodb')
require('dotenv').config();

// Config cloundinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
    secure: true
});

// Upload image to cloudinary
async function uploadImage(path) {
    const result = cloudinary.uploader.upload(path, { resource_type: "image" })
        .then(result => { return result })
        .catch(error => {
            console.log('cloudinary', error);
            return { error: true, data: error };
        })
    return result;
}

// User profile page
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

// User storage page
async function getUserLibrary(req, res, next) {
    try {
        const tab = req.query.tab || 'history';
        const userId = req.params.uid;

        const user = await User.findById(userId, 'name library -_id following')
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
            total: user.library.collections.total_collect,
            follow: user.following,
            userId: userId,
            tab: tab
        });
    } catch (err) { console.log(err.message) }
}

// History API
async function deleteHistory(req, res, next) {
    const userId = req.params.uid
    const hisId = req.params.hid

    var query = { _id: userId }
    var update = { $pull: { "library.history.mangaCollect": { manga: hisId } } }
    var option = { upsert: true, setDefaultsOnInsert: true, new: true }
    await User.updateOne(query, update, option)
        .then(result => {
            res.json({ isSuccess: true }) //{ success: true, message: "Cập nhật thông tin truyện thành công!", newManga: result }
        }).catch(function (err) {
            console.log(err.message)
            res.json({ isSuccess: false, msg: err.message }) //{ success: false, message: "Xoá lịch sử không thành công!"}
        });
}

// User collection detail page
async function getCollection(req, res, next) {
    try {
        const userId = req.params.uid;
        const collectId = req.query.cid;
        const user = await User.findById(userId, 'name library')
            .populate('library.collections.collect.mangaCollect.manga',
                'cover slug title views follower finished description')
        const collect = user.library.collections.collect.id(collectId)
        res.render('collection', {
            title: `Library | Komic`,
            script: ['storage'],
            collection: JSON.parse(JSON.stringify(collect)),
            userId: userId
        });
    } catch (err) { console.log(err.message) }
}

// Collection API
async function addCollection(req, res, next) {
    const userId = req.params.uid
    const newCollection = {
        title: req.body.title,
        total: 0,
        mangaCollect: []
    }
    //res.send('connect')
    try {
        const user = await User.findById(userId)
        user.library.collections.collect.push(newCollection)
        const newCollect = user.library.collections.collect[0]
        console.log(newCollect)
        user.save(function (err) {
            if (err) {
                console.log(err.message)
                res.send({ isSuccess: false, msg: err.message }) //{ success: false, message: "Xoá lịch sử không thành công!"}
            } else {
                console.log('Success!');
                res.send({ isSuccess: true, newCollection: newCollect }) //{ success: true, message: "Cập nhật thông tin truyện thành công!", newManga: result }
            }
        });
    } catch (err) {
        console.log(err.message)
        res.send({ isSuccess: false, msg: err.message }) //{ success: false, message: "Xoá lịch sử không thành công!"}
    }
}

async function editCollection(req, res, next) {
    const userId = req.params.uid
    const collectId = req.body.cid
    console.log(collectId)
    //res.send('connect')
    try {
        const user = await User.findById(userId)
        user.library.collections.collect.id(collectId).title = req.body.title
        console.log(user.library.collections.collect.id(collectId))
        user.save(function (err) {
            if (err) {
                console.log(err.message)
                res.status(400).send({ isSuccess: false, msg: err.message }) //{ success: false, message: "Xoá lịch sử không thành công!"}
            } else {
                console.log('Success!');
                res.status(200).send({ isSuccess: true }) //{ success: true, message: "Cập nhật thông tin truyện thành công!", newManga: result }
            }
        });
    } catch (err) {
        console.log(err.message)
        res.send({ isSuccess: false, msg: err.message }) //{ success: false, message: "Xoá lịch sử không thành công!"}
    }
}

async function deleteCollection(req, res, next) {
    const userId = req.params.uid
    const collectId = req.params.cid

    var query = { _id: userId }
    var update = {
        $pull: { "library.collections.collect": { _id: collectId } },
        $inc: {
            "library.collections.total_collect": -1,
            /* "following": { "library.collections.collect.$.total": { _id: collectId } } */
        }
    }
    var option = { upsert: true, setDefaultsOnInsert: true, new: true }
    await User.updateOne(query, update, option)
        .then(result => {
            res.json({ isSuccess: true }) //{ success: true, message: "Cập nhật thông tin truyện thành công!", newManga: result }
        }).catch(function (err) {
            console.log(err.message)
            res.json({ isSuccess: false, msg: err.message }) //{ success: false, message: "Xoá lịch sử không thành công!"}
        });
}

async function deleteCollectionItem(req, res, next) {
    const userId = req.params.uid
    const collectId = req.params.cid
    const mangaId = req.params.mid

    var query = { _id: userId, 'library.collections.collect._id': collectId }
    var update = { $pull: { "library.collections.collect.mangaCollect": { manga: mangaId } } }
    var option = { upsert: true, setDefaultsOnInsert: true }
    await User.updateOne(query, update, option)
        .then(result => {
            res.json(result) //{ success: true, message: "Cập nhật thông tin truyện thành công!", newManga: result }
        }).catch(function (err) {
            console.log(err.message)
            res.json(result) //{ success: false, message: "Xoá lịch sử không thành công!"}
        });
}

module.exports = {
    getUserProfile, getUserLibrary, deleteHistory,
    getCollection, deleteCollectionItem, deleteCollection, addCollection, editCollection
};