const Manga = require('../models/manga');
const Category = require('../models/category');

async function getTopView(req, res){
    const param = req.params['id'];
    const topViews = await Manga.find()
        .sort({'views' : -1})
        .limit(6)
        .populate({
            path: 'categories'
        })
        .lean()
    console.log(param)
    res.json(topViews)
}

async function getCategory(req, res){
    let id = req.params.id;
    let perPage = 6; 
    let page = req.query.page || 1; 
    let sort = req.query.sort || 'must_views'
    let sortQuery = initSortQuery(sort);

    const newManga = await Manga.find()
        .sort({'createdAt' : -1})
        .limit(5)
        .populate({
            path: 'categories'
        })
        .lean()

    const category = await Category.findById(id).lean();

    let maxPage = await  Manga.countDocuments({"categories": category._id})
    maxPage = Math.ceil(maxPage / perPage);

    const topViews = await Manga.find()
        .sort({'views' : -1})
        .limit(6)
        .populate({
            path: 'categories'
        })
        .lean()
    
    const products = await Manga.find({"categories": category._id})
        .sort(sortQuery)
        .skip((perPage * page)- perPage)
        .limit(perPage)
        .populate({
            path: 'categories'
        })
        .lean();

    category.products = products;

    res.render('categories', {categories: [category], topViews: topViews, newComment: topViews, news: newManga, pages: maxPage, currentPage: page})
}

function initSortQuery(sortOption){
    switch(sortOption){
        case "must_views":{
            return {"views": -1}
        }
        case "least_views":{
            return {"views": 1}
        }
        case "namea_z":{
            return {"title": 1}
        }
        case "namez_a":{
            return {"title": -1}
        }
        default: {
            return {"views": -1}
        }      
    }
}

module.exports = {
    index: function(req, res) {
        res.render('manga-details', {
            title: 'Lorem ipsum dolor | Komic',
            script: 'manga-details.js'
        })
    },
    read: function(req, res) {
        res.render('manga-reading', {
            title: 'Lorem ipsum dolor - Chapter 1 | Komic',
            script: 'manga-reading.js'
        })
    },
    add: function(req, res){
        const manga = new Manga({
            title: 'Lorem'
        });
        manga.save()
            .then((result) => {
                res.send(result)
            })
            .catch((err) => {
                console.log(err)
            });
    },
    getTopView,
    getCategory
    
};

