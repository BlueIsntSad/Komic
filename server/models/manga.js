const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

const mangaSchema = new Schema({
    cover: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        default: ''
    },
    title: {
        type: String,
        required: true,
        default: 'No Name'
    },
    title_org: {
        type: String,
        default: 'Unknown'
    },
    slug: {
        type: String,
        //required: true,
        unique: true,
        default: ''
    },
    description: {
        type: String,
        required: true,
        default: 'No Type'
    },
    author: {
        type: String,
        default: 'No author',
    },
    translator: {
        type: String,
        default: 'No translator',
    },
    status: {
        type: String,
        default: 'Unknown',
        required: true
    },
    releaseDay: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    follower: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    categories: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
        default: []
    },
    chapters: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Chapter' }],
        required: true,
        default: []
    },
    total: {
        type: Number,
        default: 0
    },
    finished: {
        type: Number,
        default: 0
    },
    rate: {
        type: Number,
        default: 0
    },
    totalRate: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

const ratingSchema = new Schema({
    score: Number,
    voteFor: {
        type: Schema.Types.ObjectId,
        ref: 'Manga'
    },
    voteBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

ratingSchema.post('save', async rate => {
    var mangaId = rate.voteFor
    const data = await ratingS.aggregate([
        { $match: { 'voteFor': ObjectId(mangaId) } },
        {
            $group: {
                "_id": "$voteFor",
                "totalRate": { "$sum": 1 },
                "avgRate": { $avg: "$score" }
            }
        }
    ])
    console.log(data[0])
    await mangaS.updateOne(
        { _id: mangaId },
        { rate: data[0].avgRate, totalRate: data[0].totalRate }
    )
})

const mangaS = mongoose.model('Manga', mangaSchema);
const ratingS = mongoose.model('Rating', ratingSchema);

module.exports = { Manga: mangaS, Rating: ratingS };