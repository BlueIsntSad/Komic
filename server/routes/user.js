const express = require('express');
const router = express.Router();
/*var uid = req.user.id;
console.log(uid);*/
// Require controller
const controller = require('../controllers/user');
const { forwardUser} = require('../config/auth');
// GET user profile page
router.get('/', forwardUser,function (req, res) {
    res.redirect('/login');
})
router.get('/', forwardUser,function (req, res) {
    res.redirect('/login');
})

router.route('/:uid')
    .get(controller.getUserProfile)
    .put(controller.editUserProfile)

router.route('/:uid/storage')
    .get(controller.getUserLibrary)
    .put(controller.addCollection)

// User API
router.route('/:uid/storage/deleteHistory/:hid')
    .put(controller.deleteHistory)

router.route('/:uid/storage/collection')
    .get(controller.getCollection)
    .put(controller.editCollection)

router.route('/:uid/storage/deleteCollectionItem/:cid/:mid')
    .put(controller.deleteCollectionItem)

router.route('/:uid/storage/deleteCollection/:cid')
    .put(controller.deleteCollection)

router.route('/:uid/:mid')
    .post(controller.ratingManga)
    //.put(controller.rerateManga)
    //.delete(controller.unrateManga)

module.exports = router;