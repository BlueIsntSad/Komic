const express = require('express');
const router = express.Router();

// Require controller
const controller = require('../controllers/user');

// GET user profile page
router.get('/', function (req, res) {
    res.redirect('/login');
})

router.route('/:uid')
    .get(controller.getUserProfile)

router.route('/:uid/storage')
    .get(controller.getUserLibrary)

router.route('/:uid/storage/deleteHistory/:hid')
    .put(controller.deleteHistory)

router.route('/:uid/storage/collection')
    .get(controller.getCollection)
    //.put(controller.addCollection)

/* router.route('/:uid/storage/editCollection/:cid')
    .put(controller.editCollection) */

router.route('/:uid/storage/editCollectionItem/:cid/:mid')
    .put(controller.editCollectionItem)

router.route('/:uid/storage/deleteCollection/:cid')
    .put(controller.deleteCollection)

module.exports = router;