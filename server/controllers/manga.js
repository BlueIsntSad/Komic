const Manga = require('../models/manga');
const Category = require('../models/category');
const Chapter = require('../models/chapter');
const category = require('../models/category');
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
    res.json(topViews)
}

async function getCategory(req, res) {
    let id = req.params.id;
    let perPage = 12;
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

    const category = await Category.findOne({ slug: id }).lean();
    if (!category)
        return res.redirect('/manga/categories')
    let maxPage = await Manga.countDocuments({ "categories": category._id })
    maxPage = Math.ceil(maxPage / perPage);

    const topViews = await getMangaTopviews();
    const newComment = await getMangaNewComment()

    const products = await Manga.find({ "categories": category._id })
        .sort(sortQuery)
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .populate({
            path: 'categories'
        })
        .lean();

    category.products = products;
    category.sort = sort
    res.render('categories', { categories: [category], topViews: topViews, newComment: newComment, pages: maxPage, currentPage: page })
}

function initSortQuery(sortOption) {
    switch (sortOption) {
        case "must_views": {
            return { "views": 1 }
        }
        case "least_views": {
            return { "views": -1 }
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

async function getAllCategoryPage(req, res) {
    let perPage = 12;
    let page = req.query.page || 1;
    const categories = await Category.find()
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .lean();
    for await (let category of categories) {
        const mangas = await Manga.find({ categories: category._id }).limit(9).lean();
        const count = await Manga.countDocuments({ categories: category._id })
        category.mangas = mangas,
            category.count = count - 8;
    }
    const toast = { type: "error", title: "Thất bại", message: "Tải thông tin truyện thất bại" }
    res.render('all-category', { categories })
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
    var mangaSlug = req.params.manga;
    await Manga.findOne({ slug: mangaSlug })
        .lean()
        .populate('categories')
        .populate('chapters')
        .then(async function (mangaDoc) {
            const comments = await Comment.find({ slug: mangaSlug }).
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


async function getMangaTopviews() {
    const topViews = await Manga.find()
        .sort({ 'views': -1 })
        .limit(6)
        .populate({
            path: 'categories'
        })
        .lean()

    return topViews;
}

async function getMangaNewComment() {
    const newComment = await Comment.find()
        .sort({ "createdAt": -1 })
        .limit(6)
        .select({ "onManga": 1 })
        .lean();
    const newComments = await Comment.aggregate(
        [
            {
                "$group": {
                    "_id": '$onManga',
                    "date": { "$max": "$createdAt" }
                }
            },
            { "$sort": { "createdAt": -1 } },
            { "$limit": 6 }
        ]
    )

    const ids = newComments.map(item => { return item._id })
    const manga = await Manga.find({ "_id": { $in: ids } }).lean();;
    return manga;
}



async function readChapter(req, res) {
    var mangaSlug = req.params.manga;
    var chapterIndex = req.params.chapter;
    await Manga.findOne({ slug: mangaSlug })
        .lean()
        .populate('chapters')
        .then(async function (mangaDoc) {
            res.render('manga-reading', {
                //chapter: EpDoc,
                title: `${mangaDoc.title} - Chapter X | Komic`,
                script: 'manga-reading.js'
            })
        })
}

module.exports = { index, getMangaDetails, read, readChapter, getTopView, getCategory, getAllCategoryPage, getMangaTopviews, getMangaNewComment };

