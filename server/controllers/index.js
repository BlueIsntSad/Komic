const Category = require("../models/category");
const { Manga } = require("../models/manga");
const mangaController = require("./manga")
// const Comment = require("../models/")

async function index(req, res, next) {
    const manga = await Manga.find()
        .sort({ 'createdAt': -1 })
        .limit(5)
        .populate({
            path: 'categories'
        })
        .lean()

    const categories = await Category.find().limit(3).lean();
    for (let i = 0; i < categories.length; i++) {
        const mangas = await Manga.find({ "categories": categories[i]._id })
            .sort({ "views": -1 })
            .limit(9)
            .populate({
                path: 'categories'
            })
            .lean();
        categories[i].mangas = mangas;
    }

    const topViews = await mangaController.getMangaTopviews();
    const newComment = await mangaController.getMangaNewComment();
    res.render('home', { categories: categories, topViews: topViews, newComment: newComment, news: manga, cateList: res.locals.categoryList })
}

module.exports.index = index;