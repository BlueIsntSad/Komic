require('dotenv').config();
const Manga = require('../server/models/manga');
const Chapter = require('../server/models/chapter');
const Category = require('../server/models/category');
const faker = require('faker');
const async = require('async');
const mongoose = require('mongoose');

let database = process.env.db_URI
new Promise((resolve) => {
    console.log('Seeding manga .....');
    mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true});
    async.parallel([
        (callback) => {
            Category.find({}, '_id')
                .exec((err, cate_ids) => { callback(null, cate_ids) });
        },
        (callback) => {
            Chapter.find({}, '_id')
                .exec((err, chap_ids) => { callback(null, chap_ids) });
        }
    ], (err, results) => { resolve(results) });
}).then((results) => {
    return new Promise((resolve) => {
        let covers = [
            'https://res.cloudinary.com/hehohe/image/upload/v1638279939/manga/cover/shiro_AKUTAMI-SENSEI_DAY_on_Twitter_jhw4bg.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279938/manga/cover/KonoSuba_tem_novo_jogo_anunciado_para_final_do_ano_com_hist%C3%B3ria_maluca_e_original_oyvzwu.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279937/manga/cover/Goku_Poster_by_Koku78_on_DeviantArt_grgt0u.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279937/manga/cover/d793aa6fc8fb8872d5b5dd0b873db7b0_hhfhra.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279939/manga/cover/Riku_on_Twitter_fg6olt.png',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279939/manga/cover/Owari_no_Seraph_Seraph_Of_The_End_Mobile_Wallpaper_1651739_-_Zerochan_Anime_Image_Board_kdwjye.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279938/manga/cover/Food_Wars_TV_Series_2015_-_IMDb_zqthhd.png',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279936/manga/cover/Tokyo_Ghoul_Anime_-_Horror_Anime_Series_w8dkn1.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279936/manga/cover/23950be5da29b3eedd7d892ab8cfa9b8_hbsctu.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279936/manga/cover/Anime_Jikan_no_Shihaisha_Reveals_Key_Visual_and_Teaser_Video___MANGA_TOKYO_mwrx0m.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279938/manga/cover/Itsudatte_Bokura_no_Koi_wa_10_cm_Datta_Reveals_Second_Trailer_and_Additional_Cast___MANGA_TOKYO_c9mnzs.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279937/manga/cover/Dr__Stone_-_Key_Visual_au7dot.png',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279938/manga/cover/my_hero_academia_x_readers_bvq254.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279937/manga/cover/Hellsing_11x17_TV_Poster_2001_lrbvt5.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279936/manga/cover/1182cbef89b9469df18d4a1c10ffa2ea_pouuh0.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279936/manga/cover/SK_SK8_the_Infinity_-_Primeiras_impress%C3%B5es_-_Meta_Galaxia_ef9ax7.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279937/manga/cover/147119bb1f8c433ea765c4452375d1e3_xttfbk.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279936/manga/cover/346eb9d5374745eb943cd1e65f3d6109_zvagei.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279936/manga/cover/The_Promised_Neverland_TV_Series_2019_2021_-_IMDb_rmfspf.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638279936/manga/cover/Zankyou_no_Terror_ies61l.jpg',
            'https://res.cloudinary.com/hehohe/image/upload/v1638207497/manga/cover/cover_ua1xge.png'
        ];
        let japan_titles = [
            'シューリンガンの',
            '処、やぶら小路の藪柑子',
            'ピーのポンポコナーの',
            '水魚の。五劫の擦り切れ',
            'パイポパ',
            '来末 風来末。長久',
            'ピーのポンポ'
        ];
        let status = ['Đã hoàn thành','Đang tiến hành','Drop','Sắp ra mắt'];
        let mangas = [];
        for (i = 0; i < 10; i++) {
            // categories
            let categories = [];
            for (j = 0; j < faker.datatype.number({ 'min': 2, 'max': 5 }); j++) {
                categories.push(faker.random.arrayElement(results[0])._id)
            }
            // chapters
            let chapters = [];
            for (j = 0; j < faker.datatype.number(30); j++) {
                chapters.push(faker.random.arrayElement(results[1])._id)
            }
            let total = faker.datatype.number(100);
            mangas.push(
                {
                    cover: faker.random.arrayElement(covers),
                    title: faker.name.title(),
                    title_org: faker.random.arrayElement(japan_titles),
                    description: faker.lorem.paragraphs(),
                    author: faker.name.findName(),
                    translator: faker.name.findName(),
                    status: faker.random.arrayElement(status),
                    releaseDay: faker.random.arrayElement([faker.date.past(),faker.date.future()]),
                    views: faker.datatype.number(),
                    categories: categories,
                    chapters: chapters,
                    total: total,
                    finished: total - faker.datatype.number(total),
                    rate: faker.datatype.number(5),
                    totalRate: faker.datatype.number()
                }
            );
        }
        resolve(mangas);
    });
}).then(async function (mangas) {
    for (var i = 0; i < mangas.length; i++) {
        var manga = new Manga(mangas[i]);
        await manga.save();
    }
    mongoose.disconnect();
    console.log(`Seed ${mangas.length} mangas`);
}).catch((err) => console.log(err));