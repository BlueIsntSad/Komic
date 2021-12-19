const Category = require("../models/category");

async function getCategories(req, res, next) {
    console.log('Middleware-------------')
    const category = await Category.find({}, 'name slug -_id')
        .sort('name')
        .lean();

    console.log(category)
    res.locals.categoryList = category
    next()
}

module.exports = { getCategories };
