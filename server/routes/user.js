const express = require('express');
const router = express.Router();

// Require controller
const controller = require('../controllers/user');

// GET user profile page
router.get('/', controller.index)

router.get('/add', controller.add)

router.get('/storage/:uid', controller.getUserStorage)

router.get('/:uid', controller.getUserProfile)

module.exports = router;