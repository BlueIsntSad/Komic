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
    password: { type: String, required: true },
    avatar: { type: String, default: '/img/avatar_default.png' },
    cover: { type: String, default: '/img/avatar_default.png' },
    about: String,
    adress: String,
    follower: { type: Number, default: 0, min: 0 },
    views: { type: Number, default: 0, min: 0 },
    library: {
        history: {
            total: { type: Number, default: 0 },
            mangaCollect: [
                {
                    manga: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Manga' },
                    lastRead: { type: Date, default: Date.now },
                    _id : false
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
                        { manga: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Manga' }, _id : false }
                    ]
                }
            ]
        }
    }
}, { timestamps: true });

userSchema.index({ account: 1 }, { unique: true })

userSchema.methods.getHistory = function() {
    const mangaCollect = this.library.history.mangaCollect.slice(0, 3);
    console.log(mangaCollect);
    return mangaCollect;
}

userSchema.pre('save', function(next) {
    this.library.history.total = this.library.history.mangaCollect.length;
    this.library.collections.collect.forEach(collectList => {
        collectList.total = collectList.mangaCollect.length;
    })
    next()
})


const commentSchema = new Schema({
    body: { type: String, required: true },
    byUser: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
    onManga: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Manga' },
    commentAt: { type: Date, default: Date.now }
}, { timestamps: true })


const userS = mongoose.model('User', userSchema);
const adminS = mongoose.model('Admin', adminSchema);
const commentS = mongoose.model('Comment', commentSchema);

module.exports = { User: userS, Admin: adminS, Comment: commentS };