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

// GET manga details page
router.get('/', controller.index)

// GET manga reading page
router.get('/ep', controller.read)

router.get('/add', controller.add)

router.get('/:id', controller.getMangaDetails)

//GET top view 
router.get("/top/:id", controller.getTopView)

//GET category


module.exports = router;