require('dotenv').config();
const { User, Comment } = require('../server/models/user');
const { Manga } = require('../server/models/manga');
const Chapter = require('../server/models/chapter');
const faker = require('faker');
const async = require('async');
const mongoose = require('mongoose');

var database = process.env.db_URI
new Promise((resolve) => {
    console.log('Seeding comment .....');
    mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true });
    async.parallel([
        (callback) => {
            User.find({}, '_id')
                .exec((err, u_ids) => { callback(null, u_ids) });
        },
        (callback) => {
            Manga.find({}, '_id')
                .exec((err, manga_ids) => { callback(null, manga_ids) });
        },
        (callback) => {
            Chapter.find({}, '_id')
                .exec((err, chap_ids) => { callback(null, chap_ids) });
        }
    ], (err, results) => { resolve(results) });
}).then((results) => {
    return new Promise((resolve) => {
        var comments = [];
        for (i = 0; i < 200; i++) {
            comments.push(
                {
                    content: faker.lorem.sentences(faker.datatype.number({ 'min': 1, 'max': 3 })),
                    byUser: faker.random.arrayElement(results[0])._id,
                    onManga: faker.random.arrayElement(results[1])._id,
                    onChapter: faker.random.arrayElement(results[2])._id,
                    createdAt: faker.date.past(),
                }
            );
        }
        resolve(comments);
    });
}).then(async function (comments) {
    for (var i = 0; i < comments.length; i++) {
        var comment = new Comment(comments[i]);
        await comment.save();
    }
    mongoose.disconnect();
    console.log(`Seed ${comments.length} comments`);
}).catch((err) => console.log(err));