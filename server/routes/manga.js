const express = require('express');
const manga_router = express.Router();

// Require controller
const controller = require('../controllers/manga');

// GET manga page details page
manga_router.get('/', controller.index)

module.exports = manga_router;