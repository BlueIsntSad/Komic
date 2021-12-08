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

router.get('/:manga', controller.getMangaDetails)

//GET top view 
router.get("/top/:id", controller.getTopView)

router.get('/:manga/:chapter', controller.readChapter)
//GET category


module.exports = router;