require('dotenv').config();
const { User } = require('../server/models/user');
const Manga = require('../server/models/manga');
const faker = require('faker');
const async = require('async');
const mongoose = require('mongoose');

let database = process.env.db_URI
new Promise((resolve) => {
    console.log('Seeding user .....');
    mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true });
    async.parallel([
        (callback) => {
            Manga.find({}, '_id')
                .exec((err, manga_ids) => { callback(null, manga_ids) });
        }
    ], (err, results) => { resolve(results) });
}).then((results) => {
    return new Promise((resolve) => {
        /* let avatars = [
            'https://res.cloudinary.com/hehohe/image/upload/v1638283170/user/avatar/avatar_default_aj6y4x.png',
            'https://res.cloudinary.com/hehohe/image/upload/v1638283168/user/avatar/avatar_1_u17axd.png',
            'https://res.cloudinary.com/hehohe/image/upload/v1638283169/user/avatar/avatar_2_mxahrf.png',
            'https://res.cloudinary.com/hehohe/image/upload/v1638283170/user/avatar/avatar_3_bw4jt1.png',
            'https://res.cloudinary.com/hehohe/image/upload/v1638283170/user/avatar/avatar_4_shc2lg.png',
            'https://res.cloudinary.com/hehohe/image/upload/v1638283170/user/avatar/avatar_5_rq2nyu.png'
        ]; */
        let bg_covers = [
            'https://res.cloudinary.com/hehohe/image/upload/v1638204582/user/background%20cover/1761712_uxppo5.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638204686/user/background%20cover/50151941487_714af20b28_b_me0nmg.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638284107/user/background%20cover/44250e8851e607a8fa7bcaf1d1906bc5_bv1kd4.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638284107/user/background%20cover/1695b611d648571b62adfd8f0d439bd0_blpjfx.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638284107/user/background%20cover/49588bb573d521482b58174210adbb77_i7yndc.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638284108/user/background%20cover/225e2123bf19210e87ca0ab97de71de3_xywjkv.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638284108/user/background%20cover/c0c4f06b14625c8fb9c4cdcbaa58c6d8_vcn1ch.png',
            'https://res.cloudinary.com/hehohe/image/upload/v1638284108/user/background%20cover/c3813a756f0a9d32a5bf4dc98a6e90d4_ut3ses.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638284108/user/background%20cover/ec29ab99a58e776d1848f969aa1978dd_kkwnfk.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638284108/user/background%20cover/de17e77ee58a403ba423de7172e01121_la24vj.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638284109/user/background%20cover/sunset-pathway-anime-girl-original_nkeuev.jpg'
        ];
        let users = [];
        for (i = 0; i < 6; i++) {
            // histories
            let histories = [];
            for (j = 0; j < faker.datatype.number(10); j++) {
                histories.push({manga: faker.random.arrayElement(results[0])._id})
            }
            // collections
            let collections = [];
            for (j = 0; j < faker.datatype.number(5); j++) {
                collect = [];
                for (k = 0; k < faker.datatype.number(10); k++) {
                    collect.push( {manga: faker.random.arrayElement(results[0])._id} );
                }
                collections.push({
                    title: faker.name.title(),
                    mangaCollect: collect
                });
            }

            users.push(
                {
                    name: faker.name.findName(),
                    account: faker.internet.userName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    avatar: `https://picsum.photos/id/${faker.datatype.number(1000)}/300/300`,//avatars[i],
                    cover: faker.random.arrayElement(bg_covers),
                    about: faker.lorem.sentences(),
                    adress: `${faker.address.cityName()}, ${faker.address.country()}`,
                    library: {
                        history: { mangaCollect: histories },
                        collections: collections
                    }
                }
            );
        }
        resolve(users);
    });
}).then(async function (users) {
    for (var i = 0; i < users.length; i++) {
        var user = new User(users[i]);
        await user.save();
    }
    mongoose.disconnect();
    console.log(`Seed ${users.length} users`);
}).catch((err) => console.log(err));