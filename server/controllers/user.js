const { User, Admin } = require('../models/user');
const Manga = require('../models/manga');

/* async function getMangaList(mangaList) {
    let block = [];
    for (var i = 0; i < 3; i++) {
        await Manga.findById(mangaList[i].manga_id)
            .then(mangaDoc => { block.push(mangaDoc) })
            .catch(function (err) { console.log(err) });
    }
    return block;
}; */
/* function getCollection() {
    var manga = this.library.history.mangaCollect.populate('manga');
    console.log(manga);
} */

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
        /* .getCollection().exec(function (err, user) {
            var manga = user.library.history.mangaCollect.populate('manga');
            console.log(manga);
        }) */
        .then(userDoc => {
            console.log(userDoc.library.collections.collect)
            res.render('profile', {
                user: userDoc,
                title: `${userDoc.name} | Komic`,
                history: userDoc.library.history.mangaCollect.slice(0, 3),
                collections: userDoc.library.collections.collect
            });
        })
        .catch(function (err) { console.log(err) });
}

function add(req, res) {
    addExUser()
}

async function addExUser() {
    try {
        await User.findOne({ name: 'My name Bob' }).deleteOne();
        const user = await User.create({
            name: 'My name Bob',
            account: '@Bobbypr0Vjp',
            password: '123456',
            avatar: '/img/avatar_1.png',
            about: 'Fusce sit amet ex in mi volutpat blandit. Sed imperdiet nulla et efficitur ultrices. Sed euismod lacus quis felis venenatis fringilla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc congue massa id condimentum mollis. Nulla a elementum nunc.',
            adress: 'Hue, Viet Nam',
            library: {
                history: {
                    total: 4,
                    mangaCollect: [
                        { manga: '6198c572b8cf37785e4ffcb0' },
                        { manga: '61a121dc891108d0c5ce0fcc' },
                        { manga: '61a1232559d939f20bfa0886' },
                        { manga: '6198c572b8cf37785e4ffcb0' },
                    ]
                },
                collections: {
                    total_collect: 2,
                    collect: [
                        {
                            title: 'Collection 1',
                            total: 2,
                            mangaCollect: [
                                { manga: '61a121dc891108d0c5ce0fcc' },
                                { manga: '61a1232559d939f20bfa0886' }
                            ]
                        },
                        {
                            title: 'Collection 2',
                            total: 4,
                            mangaCollect: [
                                { manga: '6198c572b8cf37785e4ffcb0' },
                                { manga: '61a121dc891108d0c5ce0fcc' },
                                { manga: '61a1232559d939f20bfa0886' },
                                { manga: '6198c572b8cf37785e4ffcb0' },
                            ]
                        }
                    ]
                }
            }
        })
        console.log(user)
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = { index, getUserProfile, add };