const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin')

router.route('/manga/chapter/:chapter/section')
    .post(controller.insertSection)

router.route('/manga/chapter/:chapter/section/:section')
    .delete(controller.deleteSection)
    .put(controller.editSection);

router.route('/manga/chapter/:id')
    .delete(controller.deleteChapter)

router.route('/manga/insert')
    .post(controller.insertManga)
    .get(controller.getInsertPage)

router.route('/manga/:manga/chapter')
    .post(controller.insertChapter)

router.route('/manga/:id')
    .get(controller.getEditPage)
    .delete(controller.deleteManga)
    .put(controller.editMangaInfo)

//Router for category mangage

router.route('/category/:id')
    .put(controller.editCategory)
    .delete(controller.deleteCategory)

router.route('/category')
    .get(controller.getCategoryPage)
    .post(controller.insertCategory)
    
// router.get('/:page', controller.getAdminPage)
router.get('/', controller.getAdminPage)

module.exports = router