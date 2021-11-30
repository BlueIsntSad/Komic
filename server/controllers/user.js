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
                history: userDoc.library.history.mangaCollect.slice(0, 3),
                collections: userDoc.library.collections.collect
            });
        })
        .catch(function (err) { console.log(err) });
}

function add(req, res) {
    seedExUser()
}

async function seedExUser() {
    try {
        await User.findOne({ name: 'My name Bob' }).deleteOne();
        const user = await User.create({
            name: 'My name Bob',
            email: 'Bobbypr0Vjp@somthing.com',
            password: '123456',
            avatar: '/img/avatar_default.png',
            about: 'Fusce sit amet ex in mi volutpat blandit. Sed imperdiet nulla et efficitur ultrices. Sed euismod lacus quis felis venenatis fringilla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc congue massa id condimentum mollis. Nulla a elementum nunc.',
            adress: 'Hue, Viet Nam',
            library: {
                history: {
                    total: 4,
                    mangaCollect: [
                        { manga: '61a58fcf453c260fc5ad5927' },
                        { manga: '61a121dc891108d0c5ce0fcc' },
                        { manga: '61a1232559d939f20bfa0886' },
                        { manga: '61a58fcf453c260fc5ad5927' },
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
                                { manga: '61a58fcf453c260fc5ad5927' }
                            ]
                        },
                        {
                            title: 'Collection 2',
                            total: 4,
                            mangaCollect: [
                                { manga: '61a58fcf453c260fc5ad5927' },
                                { manga: '61a121dc891108d0c5ce0fcc' },
                                { manga: '61a1232559d939f20bfa0886' },
                                { manga: '61a58fcf453c260fc5ad5927' },
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

async function seedComment(){
    try {
        const user = await User.findOne({});
        const chapter = await Chapter.findOne({});
        const manga = await Manga.findOne({title:"Lorem ipsum dolor: Lorem ipsum adipisic"});
        const comment = new Comment({
            content:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio labore soluta ducimus praesentium, enim necessitatibus quas nihil unde obcaecati dolor totam molestias possimus voluptatem delectus aperiam ea optio, cupiditate sapiente. Ab hic est magnam praesentium fugiat nihil eaque commodi rem tempore illum ut, sequi repellendus quae. Dolores eligendi eos nostrum impedit nobis voluptatum asperiores totam. A iusto numquam laboriosam!",
            byUser: user,
            onManga: manga,
            onChapter: chapter
        });
        console.log(comment)
        await comment.save()
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = { index, getUserProfile, add };