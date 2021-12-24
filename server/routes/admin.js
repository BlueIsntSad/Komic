const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin");

router.route("/manga/chapter/:chapter/section").post(controller.insertSection);

router
  .route("/manga/add")
  .post(controller.insertManga)
  .get(controller.getInsertPage);
router
  .route("/manga/:manga/chap/:chap/section/:section")
  .delete(controller.deleteSection)
  .put(controller.editSection);

router
  .route("/manga/:id/chap/:chapId")
  .get(controller.getEditChap)
  .put(controller.editChapter)
  .delete(controller.deleteChapter);

router
  .route("/manga/:id/addChap")
  .get(controller.getAddChapPage)
  .post(controller.insertChapter);

router.route("/manga/:id/edit").get(controller.getEditPage);

router
  .route("/manga/:id")
  .get(controller.getInfoPage)
  .delete(controller.deleteManga)
  .put(controller.editMangaInfo);

// router.get('/:page', controller.getAdminPage)
router.get("/manga", controller.getAdminPage);
router.get("/dashboard", controller.dasboard);
//Router for category mangage

router
  .route("/category/:id")
  .put(controller.editCategory)
  .delete(controller.deleteCategory);

router
  .route("/category")
  .get(controller.getCategoryPage)
  .post(controller.insertCategory);

router.get("/", controller.dasboard);

module.exports = router;
