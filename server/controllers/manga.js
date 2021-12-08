const Manga = require('../models/manga');
const Category = require('../models/category');
const Chapter = require('../models/chapter');
const category = require('../models/category');



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
    console.log(id)
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

function index(req, res) {
    res.render('manga-details', {
        title: 'Lorem ipsum dolor | Komic',
        script: 'manga-details.js'
    })
}

async function getMangaDetails(req, res) {
    var mangaId = req.params.id;
    await Manga.findById(mangaId)
        .lean()
        .then(mangaDoc => {
            res.render('manga-details', {
                manga: mangaDoc,
                title: `${mangaDoc.title} | Komic`,
                script: 'manga-details'
            });
        })
        .catch(function (err) { console.log(err) });
}

function read(req, res) {
    res.render('manga-reading', {
        title: 'Lorem ipsum dolor - Chapter 1 | Komic',
        script: 'manga-reading.js'
    })
}

async function add() {
    try {
        const manga = new Manga({
            cover: "https://res.cloudinary.com/hehohe/image/upload/v1638207497/manga/cover/cover_ua1xge.png",
            title: "Lorem ipsum dolor: Lorem ipsum adipisic",
            title_org: "リベンジャーズ, Feito sutei naito",
            description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio labore soluta ducimus praesentium, enim necessitatibus quas nihil unde obcaecati dolor totam molestias possimus voluptatem delectus aperiam ea optio, cupiditate sapiente. Ab hic est magnam praesentium fugiat nihil eaque commodi rem tempore illum ut, sequi repellendus quae. Dolores eligendi eos nostrum impedit nobis voluptatum asperiores totam. A iusto numquam laboriosam!",
            author: "Lorem ipsum",
            status: "Đang tiến hành",
            translator: "Dolor sit amet",
            status: "Đang tiến hành",
            follower: 4242,
            views: 1234567,
            releaseDay: "2021-11-06",
            total: 20,
            finished: 25,
            rate: 3.5,
            totalRate: 156
        });
        const chap = await Chapter.find({}).limit(5);
        const genre = await Category.find({}).limit(3);
        manga.chapters = chap;
        manga.categories = genre;
        console.log(manga)
        await manga.save()
    } catch (err) {
        console.log(err.message)
    }
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
    // const newComment = await Comment.find()
    //     .sort({ "createdAt": -1 })
    //     .limit(6)
    //     .select({ "onManga": 1 })
    //     .lean();

    // const manga = await Manga.find({ "id": { $in: newComment } });
    // return manga;
    return []
}

module.exports = { index, getMangaDetails, read, add, getTopView, getCategory, getAllCategoryPage, getMangaTopviews, getMangaNewComment };

