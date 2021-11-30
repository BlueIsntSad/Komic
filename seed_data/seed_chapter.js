require('dotenv').config();
const Chapter = require('../server/models/chapter');
const Page = require('../server/models/section');
const faker = require('faker');
const async = require('async');
const mongoose = require('mongoose');

let database = process.env.db_URI
new Promise((resolve) => {
    mongoose.connect(database, {useNewUrlParser: true, useUnifiedTopology: true});
    async.parallel([
        (callback) => {
            Page.find({}, '_id')
                .exec((err, page_ids) => { callback(null, page_ids) });
        }
    ], (err, results) => { resolve(results) });
}).then((results) => {
    return new Promise((resolve) => {
        let chaps = [];
        let indexs = ['0', '1', '1a', '1b', '1.1', '2', '2a', '2b', '2c', '2.1', '2.2', '2.3', '3', '4', '5']
        for (i = 0; i < 20; i++) {
            let pages = [];
            for (j = 0; j < faker.datatype.number({ 'min': 3, 'max': 10 }); j++) {
                pages.push(faker.random.arrayElement(results[0])._id)
            }
            chaps.push(
                {
                    index: faker.random.arrayElement(indexs),
                    name: faker.name.title(),
                    views: faker.datatype.number(),
                    sections: pages
                }
            );
        }
        resolve(chaps);
    });
}).then(async function (chaps) {
    for (var i = 0; i < chaps.length; i++) {
        var chap = new Chapter(chaps[i]);
        await chap.save();
    }
    mongoose.disconnect();
    console.log(`Seed ${chaps.length} chapters`);
}).catch((err) => console.log(err));