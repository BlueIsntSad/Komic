const Manga = require('../models/manga');
const Category = require('../models/category');
const Chapter = require('../models/chapter');
const { User, Comment } = require('../models/user');

async function getTopView(req, res) {
    const param = req.params['id'];
    const topViews = await Manga.find()
        .sort({ 'views': -1 })
        .limit(6)
        .populate({
            path: 'categories'
        })
        .lean()
    console.log(param)
    res.json(topViews)
}

async function getCategory(req, res) {
    let id = req.params.id;
    let perPage = 6;
    let page = req.query.page || 1;
    let sort = req.query.sort || 'must_views'
    let sortQuery = initSortQuery(sort);

    const newManga = await Manga.find()
        .sort({ 'createdAt': -1 })
        .limit(5)
        .populate({
            path: 'categories'
        })
        .lean()

    const category = await Category.findById(id).lean();

    let maxPage = await Manga.countDocuments({ "categories": category._id })
    maxPage = Math.ceil(maxPage / perPage);

    const topViews = await Manga.find()
        .sort({ 'views': -1 })
        .limit(6)
        .populate({
            path: 'categories'
        })
        .lean()

    const products = await Manga.find({ "categories": category._id })
        .sort(sortQuery)
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .populate({
            path: 'categories'
        })
        .lean();

    category.products = products;

    res.render('categories', { categories: [category], topViews: topViews, newComment: topViews, news: newManga, pages: maxPage, currentPage: page })
}

function initSortQuery(sortOption) {
    switch (sortOption) {
        case "must_views": {
            return { "views": -1 }
        }
        case "least_views": {
            return { "views": 1 }
        }
        case "namea_z": {
            return { "title": 1 }
        }
        case "namez_a": {
            return { "title": -1 }
        }
        default: {
            return { "views": -1 }
        }
    }
}

async function index(req, res) {
    await Manga.findOne()
        .lean()
        .populate('categories')
        .populate('chapters')
        .then(async function (mangaDoc) {
            const comments = await Comment.find({ onManga: mangaId }).
                lean().sort('-createdAt').populate('byUser', 'name avatar').exec()
            res.render('manga-details', {
                manga: mangaDoc,
                title: `${mangaDoc.title} | Komic`,
                script: 'manga-details',
                comments: comments
            })
        })
        .catch(function (err) { console.log(err.message) });
}

async function getMangaDetails(req, res) {
    var manga_slug = req.params.manga;
    await Manga.findOne({slug: manga_slug})
        .lean()
        .populate('categories')
        .populate('chapters')
        .then(async function (mangaDoc) {
            const comments = await Comment.find({ slug: manga_slug }).
                lean().sort('-createdAt').populate('byUser', 'name avatar').exec()
            res.render('manga-details', {
                manga: mangaDoc,
                title: `${mangaDoc.title} | Komic`,
                script: 'manga-details',
                comments: comments
            });
        })
        .catch(function (err) { console.log(err.message) });
}

function read(req, res) {
    res.render('manga-reading', {
        title: 'Lorem ipsum dolor - Chapter 1 | Komic',
        script: 'manga-reading.js'
    })
}

async function readChapter(req, res) {
    var mangaId = req.params.id;
    var mangaEp = req.params.ep;
    console.log(mangaId)
    console.log(mangaEp)
    await Manga.findById(mangaEp)
        .lean()
        .populate('chapters')
        .then(async function (EpDoc) {
            console.log('read')
            res.render('manga-reading', {
                chapter: EpDoc,
                title: `Lorem ipsum dolor - Chapter ${EpDoc.name} | Komic`,
                script: 'manga-reading.js'
            })
        })
}

module.exports = { index, getMangaDetails, read, readChapter, getTopView, getCategory };

