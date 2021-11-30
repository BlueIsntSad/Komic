const Category = require("../models/category");
const Manga = require("../models/manga")

async function index(req, res, next){
    const manga = await Manga.find()
        .sort({'createdAt' : -1})
        .limit(5)
        .populate({
            path: 'categories'
        })
        .lean()

    const categories = await Category.find().limit(3).lean();
    for(let i =0; i< categories.length; i++){
        const products = await Manga.find({"categories": categories[i]._id})
            .sort({"views": -1})
            .limit(9)
            .populate({
                path: 'categories'
            })
            .lean();
        categories[i].products = products;
    }

    const topViews = await Manga.find()
        .sort({'views' : -1})
        .limit(6)
        .populate({
            path: 'categories'
        })
        .lean()

    res.render('home', {categories: categories, topViews: topViews, newComment: [], news: manga})
}

module.exports.index = index