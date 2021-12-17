const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const adminSchema = new Schema({
    name: String,
    account: String,
    password: String
})


const userSchema = new Schema({
    name: { type: String, required: true },
    account: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '/img/avatar_default.png' },
    cover: { type: String, default: '/img/avatar_default.png' },
    following: { type: Number, default: 0 },
    about: String,
    adress: String,
    link: String,
    library: {
        history: {
            total: { type: Number, default: 0 },
            mangaCollect: [
                {
                    manga: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Manga' },
                    lastRead: { type: Date, default: Date.now },
                    _id: false
                }
            ]
        },
        collections: {
            total_collect: { type: Number, default: 0 },
            collect: [
                {
                    title: { type: String, required: true, default: 'collection' },
                    total: { type: Number, default: 0 },
                    mangaCollect: [
                        { manga: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Manga' }, _id: false }
                    ]
                }
            ]
        }
    }
}, { timestamps: true });


userSchema.methods.getHistory = function () {
    const mangaCollect = this.library.history.mangaCollect.slice(0, 3);
    console.log(mangaCollect);
    return mangaCollect;
}

userSchema.pre('save', function (next) {
    var collections = this.library.collections
    collections.total_collect = collections.collect.length

    var follows = 0
    collections.collect.forEach(collect_ => { follows += collect_.total })
    this.following = follows

    next()
})

userSchema.post('updateOne', { document: true, query: false }, function (result) {
    //const data = this._update
    console.log(result)

    /* //data.library.history.total = data.library.history.mangaCollect.length;
    data.library.collections.collect.forEach(collectList => {
        collectList.total = collectList.mangaCollect.length;
    })
    let sum = 0;
    for (let i = 0; i < data.library.collections.total_collect; i++) {
        sum += data.library.collections.collect[i].total;
    }
    data.following = sum; */

    //this.update({}, data).exec()
})


const commentSchema = new Schema({
    content: { type: String, required: true },
    byUser: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
    onManga: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Manga' },
    onChapter: { type: mongoose.SchemaTypes.ObjectId, ref: 'Chapter', default: null },
}, { timestamps: true })


const userS = mongoose.model('User', userSchema);
const adminS = mongoose.model('Admin', adminSchema);
const commentS = mongoose.model('Comment', commentSchema);

module.exports = { User: userS, Admin: adminS, Comment: commentS };