const express = require('express');
const router = express.Router();

// Require controller
const controller = require('../controllers/manga.js');

router.route("/categories/:id")
    .get(controller.getCategory)

// GET manga details page
router.get('/', controller.index)

// GET manga reading page
router.get('/ep', controller.read)

router.get('/:id', controller.getMangaDetails)

//GET top view 
router.get("/top/:id", controller.getTopView)

//GET category


module.exports = router;