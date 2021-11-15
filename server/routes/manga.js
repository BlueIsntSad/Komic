const express = require('express');
const router = express.Router();

// Require controller
const controller = require('../controllers/manga.js');

// GET manga details page
router.get('/', controller.index)

// GET manga reading page
router.get('/ep', controller.read)

router.get('/add', controller.add)

//GET top view 
router.get("/top/:id", controller.getTopView)

//GET category
router.get("/categories/:id", controller.getCategory)

module.exports = router;