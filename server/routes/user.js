const express = require('express');
const router = express.Router();

// Require controller
const controller = require('../controllers/user');

// GET user profile page
router.get('/', function(req, res) {
    res.redirect('/login');
})

router.get('/add', controller.add)

router.route('/storage/:uid')
    .get(controller.getUserLibrary)

router.route('/:uid')
    .get(controller.getUserProfile)

module.exports = router;