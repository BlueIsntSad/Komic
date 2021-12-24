const { User, Comment } = require('../models/user');
const { Manga, Rating } = require('../models/manga');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');

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
    let userId = req.user.id;
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
                collections: userDoc.library.collections.collect,
                cateList: res.locals.categoryList
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
            userId: userId,
            tab: tab,
            cateList: res.locals.categoryList
        });
    } catch (err) { console.log(err.message) }
}

// History API
async function deleteHistory(req, res, next) {
    const userId = req.params.uid
    const hisId = req.params.hid

    try {
        const user = await User.findById(userId)
        user.library.history.mangaCollect.pull({ manga: hisId })

        await user.save(function (err) {
            if (err) {
                console.log(err.message)
                res.send({ isSuccess: false, msg: err.message }) //{ success: false, message: "Xoá bộ sưu tập không thành công!"}
            } else {
                console.log('Success! Delete collection', hisId);
                res.send({ isSuccess: true }) //{ success: true, message: "Cập nhật bộ sưu tập thành công!", newManga: result }
            }
        });
    } catch (err) {
        console.log(err.message)
        res.send({ isSuccess: false, msg: err.message }) //{ success: false, message: "Xoá bộ sưu tập không thành công!"}
    }
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
            userId: userId,
            cateList: res.locals.categoryList
        })
    } catch (err) { console.log(err.message) }
}

async function getCollectionsJSON(req, res, next) {
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId, 'library')
        //.populate('library.collections.collect')

        console.log(user.library.collections)
        res.send(user.library.collections)

        //res.send({ collection: JSON.parse(JSON.stringify(collect)) })


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
    if (req.body.mangaId) {
        newCollection.mangaCollect = [
            { manga: mongoose.Types.ObjectId(req.body.mangaId) }
        ]
    }
    //res.send('connect')
    try {
        const user = await User.findById(userId)
        user.library.collections.collect.push(newCollection)
        lastPos = user.library.collections.collect.length - 1
        const newCollect = user.library.collections.collect[lastPos]
        console.log(newCollect)
        await user.save(function (err) {
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
        if (req.body.mid) {
            var newManga = { manga: mongoose.Types.ObjectId(req.body.mid) }
            user.library.collections.collect.id(collectId).mangaCollect.push(newManga)
        } else {
            user.library.collections.collect.id(collectId).title = req.body.title
        }
        console.log(user.library.collections.collect.id(collectId))
        await user.save(function (err) {
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

    try {
        const user = await User.findById(userId)
        user.library.collections.collect.pull({ _id: collectId })

        await user.save(function (err) {
            if (err) {
                console.log(err.message)
                res.send({ isSuccess: false, msg: err.message }) //{ success: false, message: "Xoá bộ sưu tập không thành công!"}
            } else {
                console.log('Success! Delete collection', collectId);
                res.send({ isSuccess: true }) //{ success: true, message: "Cập nhật bộ sưu tập thành công!", newManga: result }
            }
        });
    } catch (err) {
        console.log(err.message)
        res.send({ isSuccess: false, msg: err.message }) //{ success: false, message: "Xoá bộ sưu tập không thành công!"}
    }
}

async function deleteCollectionItem(req, res, next) {
    const userId = req.params.uid
    const collectId = req.params.cid
    const mangaId = req.params.mid

    try {
        const user = await User.findById(userId)
            .populate('library.collections.collect.mangaCollect')
        user.library.collections.collect.id(collectId).mangaCollect.pull({ manga: { _id: mangaId } })
        console.log(user.library.collections.collect.id(collectId))

        await user.save(function (err) {
            if (err) {
                console.log(err.message)
                res.send({ isSuccess: false, msg: err.message }) //{ success: false, message: "Xoá item không thành công!"}
            } else {
                console.log('Success!');
                res.send({ isSuccess: true }) //{ success: true, message: "Xoá item thành công!"}
            }
        });
    } catch (err) {
        console.log(err.message)
        res.send({ isSuccess: false, msg: err.message }) //{ success: false, message: "Xoá item không thành công!"}
    }
}

async function bookmark(req, res, next) {
    const userId = req.params.uid
    const collectId = req.params.cid
    const mangaId = req.params.mid

    /* try {
        const user = await User.findById(userId)
            .populate('library.collections.collect.mangaCollect')
        user.library.collections.collect.id(collectId).mangaCollect.pull({ manga: { _id: mangaId } })
        console.log(user.library.collections.collect.id(collectId))

        await user.save(function (err) {
            if (err) {
                console.log(err.message)
                res.send({ isSuccess: false, msg: err.message }) //{ success: false, message: "Xoá item không thành công!"}
            } else {
                console.log('Success!');
                res.send({ isSuccess: true }) //{ success: true, message: "Xoá item thành công!"}
            }
        });
    } catch (err) {
        console.log(err.message)
        res.send({ isSuccess: false, msg: err.message }) //{ success: false, message: "Xoá item không thành công!"}
    } */
}

async function commentManga(req, res, next) {
    const userId = req.params.uid
    const mangaId = req.params.mid
    const chapterId = req.query.cid;
    const commentMsg = req.body.msg
    console.log(commentMsg)

    const comment = new Comment({
        content: commentMsg,
        byUser: userId,
        onManga: mangaId,
        onChapter: chapterId
    })

    console.log(comment)

    try {
        await comment.save();
        var user = await User.findById(userId, 'name avatar').lean()
        res.send({ isSuccess: true, user: user })
        console.log('comment success')
    } catch (err) {
        console.log(err.message)
        res.send({ isSuccess: false, msg: err.message })
    }
}

async function ratingManga(req, res, next) {
    const userId = req.params.uid
    const mangaId = req.params.mid
    const score = req.query.score;

    const rating = new Rating({
        score: score,
        voteFor: mangaId,
        voteBy: userId
    })

    var user = await Rating.findOne({ voteBy: userId, voteFor: mangaId })
    if (!user) {
        try {
            await rating.save();
            res.send({ isSuccess: true })
            console.log('rate success')
        } catch (err) {
            console.log(err.message)
            res.send({ isSuccess: false, msg: err.message })
        }
    } else {
        const updateRate = await Rating.findOne({ voteBy: userId, voteFor: mangaId });
        updateRate.score = score;
        await updateRate.save();
    }


}

async function unrateManga(req, res, next) {
    const userId = req.params.uid
    const mangaId = req.params.mid
}

async function rerateManga(req, res, next) {
    const userId = req.params.uid
    const mangaId = req.params.mid
}

async function editUserProfile(req, res, next) {
    console.log('server get req')
    const userId = req.params.uid;
    const form = formidable({ multiples: true });
    console.log(form)
    try {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err.msg)
                return res.json({ isSuccess: false, message: "Chỉnh sửa không thành công!" });
            }

            const newInfo = {
                name: fields.user_name,
                about: fields.bio,
                address: fields.address,
                link: fields.link,
                updatedAt: new Date(),
            }

            console.log('Upload user background')
            // Upload background profile to img server
            if (files.bg_preview.size) {
                const result = await uploadImage(files.bg_preview.filepath);
                if (!result.error) { newInfo.cover = result.url; }
            }

            console.log('Upload user avatar')
            // Upload avatar to img server
            if (files.avatar_preview.size) {
                const result = await uploadImage(files.avatar_preview.filepath);
                if (!result.error) { newInfo.avatar = result.url; }
            }

            User.findByIdAndUpdate(userId, newInfo, { new: true }, function (err, docs) {
                if (err) {
                    console.log(err.message)
                    res.json({ isSuccess: false, message: "Cập nhật không thành công!" })
                }
                else {
                    console.log("Updated User ", docs._id);
                    res.json({ isSuccess: true, message: "Cập nhật thông tin thành công!", user: docs })
                }
            })
        });
    }
    catch (err) {
        console.log(err.msg);
        res.json({ isSuccess: false, message: "Chỉnh sửa không thành công!" });
    }
}

module.exports = {
    getUserProfile, editUserProfile, getUserLibrary, deleteHistory,
    getCollection, deleteCollectionItem, deleteCollection, addCollection, editCollection,
    ratingManga, commentManga, getCollectionsJSON
};