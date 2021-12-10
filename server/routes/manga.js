const express = require('express');
const router = express.Router();

// Require controller
const controller = require('../controllers/manga.js');

// GET all category page
router.route("/categories")
    .get(controller.getAllCategoryPage)

// GET manga of category page
router.route("/categories/:id")
    .get(controller.getCategory)

// Redirect manga details page to home page
router.get('/', function(req, res) {
    res.redirect('/');
})

// GET manga reading page
router.get('/ep', controller.read)

// GET specific manga details page
router.route('/:manga')
    .get(controller.getMangaDetails)

//GET top view 
router.get("/top/:id", controller.getTopView)

// GET specific chapter
router.route('/:manga/:chapter')
    .get(controller.readChapter)

module.exports = router;