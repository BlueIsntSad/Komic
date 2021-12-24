const Category = require("../models/category");
const { Manga } = require("../models/manga");
const Section = require("../models/section");
const Chapter = require("../models/chapter");
const { Mongoose } = require("mongoose");
const cloudinary = require("cloudinary").v2;
const formidable = require("formidable");
const slugify = require("slugify");
const { index } = require("./manga");
const { User, Comment } = require("../models/user");
const { parse } = require("path/posix");
require("dotenv").config();

//Config cloundinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
});

//Render admin homepage
async function getAdminPage(req, res) {
  try {
    const searchString = req.query.search || "";
    const page = req.query.page || 1;
    const perPage = 12;

    let regex = new RegExp(searchString, "i");
    let searchQuery = {
      $or: [
        { title: regex },
        { title_org: regex },
        { author: regex },
        { translator: regex },
      ],
    };

    const mangas = await Manga.find(searchQuery)
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate({
        path: "categories",
      })
      .lean();

    let maxPage = await Manga.countDocuments(searchQuery);
    maxPage = Math.ceil(maxPage / perPage);

    let pages = [];
    for (let i = 1; i <= maxPage; i++) {
      pages.push(i);
    }

    res.render("admin", {
      title: `Trang chủ - Tất cả truyện | Komic`,
      mangas: mangas,
      curentPage: { current: "manga", child: "" },
      page: page,
      maxPage: maxPage,
      pages: pages,
      pre: parseInt(page) - 1,
      next: parseInt(page) + 1,
      cateList: res.locals.categoryList,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/admin/dashboard");
  }
}

//Get admin insert manga page
async function getInsertPage(req, res) {
  try {
    const categories = await Category.find().lean();
    res.render("add-manga", {
      title: `Thêm truyện mới - Quản lý | Komic`,
      categories: categories,
      curentPage: { current: "addManga" },
      cateList: res.locals.categoryList,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/admin/dashboard");
  }
}

//Post insert manga to db
async function insertManga(req, res, next) {
  const form = formidable({ multiples: true });
  try {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        return;
      }
      const result = await saveNewManga(fields, files);
      res.json(result);
    });
  } catch (err) {
    console.log("insert manga", err);
    res.json({ success: false, message: "Thêm truyện không thành công!" });
  }
}

async function generateSlug(title) {
  var slug = slugify(title, {
    lower: true,
    locale: "vi",
  });
  var manga = await Manga.findOne({ slug: slug });
  if (manga) {
    console.log(slug);
    const mangaSlugs = await Manga.find({ slug: new RegExp(`^${slug}-\\d$`) });
    if (mangaSlugs.length > 0) {
      var index = 1;
      mangaSlugs.forEach((mangaItem) => {
        var slugArr = mangaItem.slug.split("-");
        index = Math.max(index, parseInt(slugArr.pop()));
      });
      index++;
      slug += "-" + index;
    } else {
      slug += "-1";
    }
  }
  return slug;
}

//PUT edit manga info
async function editMangaInfo(req, res, next) {
  const mangaId = req.params["id"];
  const form = formidable({ multiples: true });
  try {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: "Chỉnh sửa không thành công!",
          newManga: null,
        });
      }
      const result = await updateMangaInfo(mangaId, fields, files);
      res.json(result);
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Chỉnh sửa không thành công!",
      newManga: null,
    });
  }
}

//Upload image to cloudinary
async function uploadImage(path) {
  const result = cloudinary.uploader
    .upload(path, { resource_type: "image" })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log("cloudinary", error);
      return { error: true, data: error };
    });
  return result;
}

//Delete manga
async function deleteManga(req, res, next) {
  try {
    const id = req.params["id"];
    const manga = await Manga.findByIdAndDelete(id);
    for (chapter of manga.chapters) {
      const delChapter = await Chapter.findByIdAndDelete(chapter);
      if (delChapter)
        await Section.deleteMany({ _id: { $in: delChapter.sections } });
    }
    res.json({ success: true, message: "Xoá thành công!" });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Xoá không thành công!",
      errorMessage: err.message,
    });
  }
}

//Render manga info page
async function getInfoPage(req, res, next) {
  try {
    const id = req.params["id"];
    const categories = await Category.find().lean();
    const manga = await Manga.findById(id)
      .populate({
        path: "categories",
      })
      .populate({
        path: "chapters",
        populate: {
          path: "sections",
          model: "Section",
        },
      })
      .lean();

    res.render("admin-manga-info", {
      title: `${manga.title} - Quản lý | Komic`,
      categories: categories,
      manga: manga,
      curentPage: {
        current: "",
        child: true,
        href: `/admin/manga/${id}`,
        name: manga.title,
      },
      cateList: res.locals.categoryList,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/admin/manga");
  }
}

//Render manga edit page
async function getEditPage(req, res, next) {
  try {
    const id = req.params["id"];
    const categories = await Category.find().lean();
    const manga = await Manga.findById(id)
      .populate({
        path: "categories",
      })
      .populate({
        path: "chapters",
        populate: {
          path: "sections",
          model: "Section",
        },
      })
      .lean();

    res.render("admin-edit-manga", {
      title: `${manga.title} - Quản lý | Komic`,
      categories: categories,
      manga: manga,
      curentPage: {
        current: "",
        child: true,
        href: `/admin/manga/${id}`,
        name: manga.title,
      },
      cateList: res.locals.categoryList,
    });
  } catch (error) {
    console.log(error);
    redirect("/admin/manga");
  }
}

//Render add chapter
async function getAddChapPage(req, res, next) {
  try {
    const id = req.params["id"];
    const categories = await Category.find().lean();
    const manga = await Manga.findById(id)
      .populate({
        path: "categories",
      })
      .populate({
        path: "chapters",
        populate: {
          path: "sections",
          model: "Section",
        },
      })
      .lean();

    res.render("admin-addChap", {
      title: `${manga.title} - Thêm chương mới | Komic`,
      categories: categories,
      manga: manga,
      curentPage: {
        current: "",
        child: true,
        href: `/admin/manga/${manga._id}`,
        name: manga.title,
      },
      cateList: res.locals.categoryList,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/admin/manga");
  }
}

//Delete Chapter
async function deleteChapter(req, res, next) {
  const mangaId = req.params["id"];
  const chapId = req.params["chapId"];
  try {
    const manga = await Manga.findOne({ _id: mangaId, chapters: chapId });
    if (!manga)
      return res.json({
        success: false,
        message: "Không tìm thấy thông tin chương!",
      });

    const delChapter = await Chapter.findByIdAndDelete(chapId);
    if (delChapter)
      await Section.deleteMany({ _id: { $in: delChapter.sections } });
    const updateQuery = {
      $pull: { chapters: delChapter._id },
      $inc: { finished: -1 },
    };
    const result = await Manga.updateOne(
      { chapters: delChapter._id },
      updateQuery
    );
    res.json({ success: true, message: "Thành công!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Không thành công!" });
  }
}

//Insert chapter
async function insertChapter(req, res, next) {
  const form = formidable({ multiples: true });
  const mangaId = req.params["id"];
  try {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        res.json({ success: false, message: "Thêm không thành công!" });
        return;
      }

      if (fields.index == "" || fields.index == undefined)
        return res.json({
          success: false,
          message: "STT chương không được để trống",
        });
      if (fields.name == "" || fields.name == undefined)
        return res.json({
          success: false,
          message: "Tên chương không thể để trống",
        });

      if (files.sections.length == 0)
        return res.json({
          success: false,
          message: "Chương phải có ít nhất một trang",
        });

      const result = await addChapterToManga(
        mangaId,
        fields.index,
        fields.name,
        files.sections
      );

      return res.json(result);
    });
  } catch (err) {
    console.log(err);
  }
}

//Render edit chap
async function getEditChap(req, res, next) {
  try {
    const mangaId = req.params["id"];
    const chapId = req.params["chapId"];
    const manga = await Manga.findOne({ _id: mangaId, chapters: chapId })
      .select({ _id: 1, title: 1 })
      .lean();
    if (!manga) return res.redirect("/404");
    const chapter = await Chapter.findById(chapId).lean().populate({
      path: "sections",
      model: "Section",
    });

    res.render("admin-edit-chap", {
      title: `${manga.title} - Chương ${chapter} - Quản lý | Komic`,
      manga: manga,
      chapter: chapter,
      curentPage: {
        current: "",
        child: true,
        href: `/admin/manga/${manga._id}`,
        name: manga.title,
      },
      cateList: res.locals.categoryList,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/admin/dashboard");
  }
}

//Edit chapter
async function editChapter(req, res, next) {
  const mangaId = req.params["id"];
  const chapId = req.params["chapId"];
  const form = formidable({ multiples: true });
  try {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        return;
      }

      const deleteSections = fields.deleteSections
        ? [].concat(fields.deleteSections)
        : [];
      const newSections = files.sections ? [].concat(files.sections) : [];
      const name = fields.name;
      const index = fields.index;

      const result = await updateChapter(
        mangaId,
        chapId,
        index,
        name,
        deleteSections,
        newSections
      );
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Cập nhật không thành công!" });
  }
}

//Delete Section
async function deleteSection(req, res, next) {
  const mangaId = req.params["manga"];
  const chapId = req.params["chap"];
  const id = req.params["section"];

  try {
    const manga = await Manga.findOne({ _id: mangaId, chapters: chapId });
    if (!manga)
      return res.json({
        success: false,
        message: "Không tìm thấy thông tin truyện!",
      });
    const chapter = await Chapter.findOne({ _id: chapId, sections: id });
    if (!chapter)
      return res.json({
        success: false,
        message: "Không tìm thấy thông tin chương!",
      });

    const delSection = await Section.findByIdAndDelete(id);
    await Chapter.updateOne(
      { sections: delSection._id },
      { $pull: { sections: delSection._id } }
    );
    res.json({ success: true, message: "Xoá thành công!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Xoá không thành công!" });
  }
}

//POST Insert section
async function insertSection(req, res, next) {
  const chapterId = req.params["chapter"];
  const form = formidable({ multiples: true });
  try {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        return;
      }
      if (chapterId != fields.chapter) return;

      try {
        var sectionsList = files[chapterId] ? [].concat(files[chapterId]) : [];
        sectionsList.sort((section1, section2) => {
          return (
            section2.originalFilename.split(".")[0] <
            section1.originalFilename.split(".")[0]
          );
        });
        const sectionIds = await addSections(sectionsList);
        const result = await Chapter.findByIdAndUpdate(
          chapterId,
          { $push: { sections: sectionIds } },
          { new: true }
        ).populate({
          path: "sections",
          model: "Section",
        });

        res.json({
          success: true,
          message: "Thêm thành công!",
          newChapter: result,
        });
      } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Thêm không thành công!" });
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Thêm không thành công!" });
  }
}

//PUT edit section
async function editSection(req, res, next) {
  const form = formidable({ multiples: true });
  try {
    const id = req.params["section"];
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        return;
      }
      const image = files.sectionImage;
      uploadImage(image.filepath)
        .then(async (imageUploaded) => {
          const result = await Section.findByIdAndUpdate(
            id,
            { url: imageUploaded.url },
            { new: true }
          );
          if (result)
            res.json({
              success: true,
              newSection: result,
              message: "Cập nhật thành công!",
            });
          else
            res.json({
              success: false,
              newSection: result,
              message: "Cập nhật không thành công!",
            });
        })
        .catch((error) => {
          console.log(error);
          res.json({
            success: false,
            newSection: null,
            message: "Cập nhật không thành công!",
          });
        });
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      newSection: null,
      message: "Cập nhật không thành công!",
      errorMessage: err.message,
    });
  }
}

//------------Category manage controller----------------------//

//Get admin category manage page
async function getCategoryPage(req, res) {
  try {
    const categories = await Category.find().lean().exec();
    res.render("category-manage", {
      title: `Thể loại - Quản lý | Komic`,
      categories: categories,
      curentPage: { current: "category", child: false },
      cateList: res.locals.categoryList,
    });
  } catch (error) {
    console.log(error);
  }
}

//POST insert category
async function insertCategory(req, res) {
  try {
    const info = req.body;
    const oldCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${info.name}$`, "i") },
    });
    if (oldCategory)
      return res.json({
        success: false,
        message: "Thêm không thành công, Tên này đã được sử dụng!",
        newCategory: null,
      });

    const slug = await generateCategorySlug(info.name);
    const newCategory = new Category({
      name: info.name,
      description: info.description,
      slug: slug,
      color: info.color,
      text_color: info.text_color,
    });

    const result = await newCategory.save();
    if (result)
      return res.json({
        success: true,
        message: "Thêm thành công!",
        newCategory: result,
      });

    return res.json({
      success: false,
      message: "Thêm không thành công!",
      newCategory: null,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Thêm không thành công!",
      newCategory: null,
    });
  }
}

async function generateCategorySlug(name) {
  var slug = slugify(name, {
    lower: true,
    locale: "vi",
  });
  var category = await Category.findOne({ slug: slug });
  if (category) {
    const categorySlugs = await Category.find({
      slug: new RegExp(`^${slug}-\\d$`),
    });
    if (categorySlugs.length > 0) {
      var index = 1;
      categorySlugs.forEach((categoryItem) => {
        var slugArr = categoryItem.slug.split("-");
        index = Math.max(index, parseInt(slugArr.pop()));
      });
      index++;
      slug += "-" + index;
    } else {
      slug += "-1";
    }
  }
  return slug;
}

//PUT edit category
async function editCategory(req, res) {
  try {
    const id = req.params["id"];
    const newInfo = {
      name: req.body.name,
      description: req.body.description,
      color: req.body.color,
      text_color: req.body.text_color,
    };
    const result = await Category.findByIdAndUpdate(id, newInfo, { new: true });
    if (result)
      return res.json({
        success: true,
        message: "Chỉnh sửa thành công!",
        newCategory: result,
      });

    res.json({
      success: false,
      message: "Chỉnh sửa không thành công!",
      newCategory: null,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Chỉnh sửa không thành công!",
      newCategory: null,
    });
  }
}

//Delete category
async function deleteCategory(req, res) {
  try {
    const id = req.params["id"];
    const manga = await Manga.findOne({ categories: id });
    if (manga)
      return res.json({
        success: false,
        message: "Xoá thành công, đã có truyện thuộc thể loại này!",
      });
    const result = await Category.findByIdAndDelete(id);
    if (result) return res.json({ success: true, message: "Xoá thành công!" });
    return res.json({ success: false, message: "Xoá không thành công" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Xoá không thành công!" });
  }
}

async function dasboard(req, res) {
  try {
    const categories = await Category.find();
    const categoriesData = await Promise.all(
      categories.map(async (category) => {
        const mangas = await Manga.find({ categories: category._id });
        var totalViews = 0;
        mangas.forEach((manga) => {
          totalViews += manga.views;
        });
        return {
          ...category._doc,
          mangas: mangas.length,
          totalViews: totalViews,
        };
      })
    );

    const totalViews = await Manga.aggregate([
      {
        $group: {
          _id: "total",
          totalViews: { $sum: "$views" },
          totalMangas: { $sum: 1 },
        },
      },
    ]);
    const totalUsers = await User.countDocuments();
    const totalComments = await Comment.countDocuments();

    const mangaStatus = await Manga.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const topViewManga = await Manga.find()
      .sort({ views: -1 })
      .select({ title: 1, views: 1 })
      .lean()
      .limit(10);

    const mangaCreated = await Manga.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    mangaCreated.sort((item1, item2) => {
      var d1 = Date.parse(item1._id);
      var d2 = Date.parse(item2._id);
      return d1 - d2;
    });

    const dashboardData = {
      categories: categoriesData,
      topViewManga: topViewManga,
      mangaStatus: mangaStatus,
      mangaCreated: mangaCreated,
      totalViews: totalViews[0].totalViews,
      totalUsers: totalUsers,
      totalComments: totalComments,
      totalMangas: totalViews[0].totalMangas,
    };

    const dashboardJSONData = JSON.stringify(dashboardData);
    res.render("dashboard", {
      title: `Báo cáo - Quản lý | Komic`,
      dashboardData: dashboardData,
      curentPage: { current: "dashboard", child: false },
      cateList: res.locals.categoryList,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/admin/dashboard");
  }
}

module.exports = {
  getAdminPage,
  getInsertPage,
  getCategoryPage,
  getAddChapPage,
  insertManga,
  deleteManga,
  getInfoPage,
  getEditPage,
  deleteChapter,
  deleteSection,
  editSection,
  insertSection,
  insertChapter,
  editMangaInfo,
  insertCategory,
  editCategory,
  deleteCategory,
  dasboard,
  getEditChap,
  editChapter,
};

//--------------ADMIN SERVICE------------------//

//Get all manga
async function getAllManga(query, perPage, page) {
  const mangas = await Manga.find(query)
    .skip(perPage * page - perPage)
    .limit(perPage)
    .populate({
      path: "categories",
    })
    .lean();
  return mangas;
}

//-----ADMIN SAVE NEW MANGA------//

const textPropName = {
  title: "Tên truyện",
  title_org: "Tên gốc",
  description: "Tóm tắt",
  author: "Tác giả",
  translator: "Dịch giả",
  status: "Tình trạng",
  releaseDay: "Ngày xuất bản",
  createdAt: "Ngày tạo",
  categories: "Thể loại",
  total: "Số tập",
};

const requiredTextProp = {
  title: "Tên truyện",
  description: "Tóm tắt",
  author: "Tác giả",
  translator: "Dịch giả",
  status: "Tình trạng",
  releaseDay: "Ngày xuất bản",
  categories: "Thể loại",
  total: "Số tập",
};

//check valid date
function isValidDate(date) {
  return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
}

//Check valid manga//
function checkManga(manga, files, isNew) {
  for (const prop in requiredTextProp) {
    if (!manga[prop])
      return {
        valid: false,
        message: `${textPropName[prop]} Không được bỏ trống!`,
      };
  }

  if (!isValidDate(manga.releaseDay))
    return { valid: false, message: `Ngày xuất bản không hợp lệ!` };
  else if (isNaN(parseInt(manga.total)) || parseInt(manga.total) < 0)
    return { valid: false, message: `Số chương không hợp lệ!` };
  else if (!files.coverImage.size && isNew)
    return { valid: false, message: "Ảnh bìa không dược để trống!" };
  else return { valid: true, message: "" };
}

//Save new manga
async function saveNewManga(fields, files) {
  const checkResult = checkManga(fields, files, true);
  if (!checkResult.valid)
    return { success: false, message: checkResult.message };

  try {
    const slug = await generateSlug(fields.title);
    const newManga = new Manga({
      title: fields.title,
      title_org: fields.title_org,
      description: fields.description,
      author: fields.author,
      translator: fields.translator,
      status: fields.status,
      releaseDay: fields.releaseDay,
      createdAt: new Date(),
      updatedAt: new Date(),
      categories: fields.categories,
      total: fields.total,
      chapter: [],
      finished: 0,
      slug: slug,
    });

    if (files.coverImage.size) {
      const result = await uploadImage(files.coverImage.filepath);
      if (!result.error) newManga.cover = result.url;
    }

    if (fields.chapter) {
      const chapterList = [].concat(fields.chapter);
      const chapterIds = await addChapters(chapterList, fields, files);
      newManga.chapters = chapterIds;
      newManga.finished = chapterIds.length;
    }

    newManga.total =
      newManga.finished > newManga.total ? newManga.finished : newManga.total;
    await newManga.save();
    return { success: true, message: "Thêm thành công!", id: newManga._id };
  } catch (err) {
    return { success: false, message: "Thêm không thành công!" };
  }
}

//Update manga info
async function updateMangaInfo(mangaId, fields, files) {
  const checkResult = checkManga(fields, files, false);
  if (!checkResult.valid)
    return { success: false, message: checkResult.message };

  try {
    const newInfo = {
      title: fields.title,
      title_org: fields.title_org,
      description: fields.description,
      author: fields.author,
      translator: fields.translator,
      status: fields.status,
      releaseDay: fields.releaseDay,
      updatedAt: new Date(),
      categories: fields.categories,
      total: fields.total,
    };

    if (files.coverImage.size) {
      const result = await uploadImage(files.coverImage.filepath);
      if (!result.error) newInfo.cover = result.url;
    }

    const result = await Manga.findByIdAndUpdate(mangaId, newInfo, {
      new: true,
    });
    if (result)
      return {
        success: true,
        message: "Cập nhật thông tin truyện thành công!",
        newManga: result,
      };
    else
      return {
        success: false,
        message: "Cập nhật thông tin truyện không thành công!",
        newManga: null,
      };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Cập nhật thông tin truyện không thành công!",
      newManga: null,
    };
  }
}

//add multiple chapters of manga
async function addChapters(chapterList, fields, files) {
  const chapterIds = [];
  for (chap of chapterList) {
    if (fields[chap] == "" || fields[chap] == undefined) continue;
    const chapter = await addChapter(fields[chap], files[chap]);
    chapterIds.push(chapter._id);
  }
  return chapterIds;
}

//add new chapter to chapters of manga
async function addChapterToManga(mangaId, index, name, sections) {
  const manga = await Manga.findById(mangaId).populate({
    path: "chapters",
  });

  if (!manga)
    return {
      success: false,
      message: "Không tìm thấy truyện chỉnh sửa!",
    };

  const chap = manga.chapters.find((chap) => chap.index == index);
  if (chap)
    return {
      success: false,
      message: "STT của chương đã được sử dụng, vui lòng chọn STT khác!",
    };

  const newChapter = await saveNewChapter(index, name, sections);
  manga.chapters.push(newChapter);

  manga.chapters.sort((chap1, chap2) => {
    return compareIndex(chap1.index, chap2.index);
  });

  const result = await manga.save();

  return {
    success: true,
    message: "Thêm chương mới thành công!",
  };
}

//Update chapter of manga
async function updateChapter(
  mangaId,
  chapId,
  index,
  name,
  deleteSections,
  newSections
) {
  try {
    const manga = await Manga.findById(mangaId).populate({
      path: "chapters",
    });

    if (!manga)
      return {
        success: false,
        message: "Không tìm thấy truyện chỉnh sửa!",
      };

    const chap = manga.chapters.find(
      (chap) => chap.index == index && chap._id != chapId
    );
    if (chap)
      return {
        success: false,
        message: "STT của chương đã được sử dụng, vui lòng chọn STT khác!",
      };

    if (deleteSections.length > 0) {
      for (let i = 0; i < deleteSections.length; i++) {
        const delSection = await Section.findByIdAndDelete(deleteSections[i]);
        await Chapter.updateOne(
          { sections: delSection._id },
          { $pull: { sections: delSection._id } }
        );
      }
    }

    const sectionIds = await addSections(newSections);
    const result = await Chapter.findByIdAndUpdate(
      chapId,
      {
        name: name,
        index: index,
        $push: { sections: sectionIds },
      },
      { new: true }
    )
      .populate({
        path: "sections",
        model: "Section",
      })
      .lean();

    return {
      success: true,
      message: "Cập nhật thành công",
      chapter: result,
      mangaId: mangaId,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Cập nhật không thành công",
      chapter: null,
      mangaId: mangaId,
    };
  }
}

//compare index
function compareIndex(index1, index2) {
  var numList1 = index1.match(/[+-]?\d+(\.\d+)?/g);
  var numList2 = index2.match(/[+-]?\d+(\.\d+)?/g);
  var strList1 = index1.match(/[a-zA-Z]+/g);
  var strList2 = index2.match(/[a-zA-Z]+/g);

  if (numList1 == null || numList2 == null) {
    if (strList1[0] < strList2[0]) return -1;
    else if (strList1[0] > strList2[2]) return 1;
    else if (numList1 == null) return -1;
    else return 1;
  }

  if (strList1 == null || strList2 == null) {
    if (parseFloat(numList1[0]) < parseFloat(numList2[0])) return -1;
    else if (parseFloat(numList1[0]) > parseFloat(numList2[0])) return 1;
    else if (strList1 == null) return -1;
    else return 1;
  }

  var isStartByNum1 = !index1.indexOf(numList1[0]);
  var isStartByNum2 = !index2.indexOf(numList2[0]);
  if (isStartByNum1 != isStartByNum2) {
    if (index1 < index2) return -1;
    else return 1;
  }

  var maxIndex = Math.max(
    strList1.length + numList1.length,
    strList2.length + numList2.length
  );

  for (var i = 0; i < maxIndex; i++) {
    if ((isStartByNum1 && i % 2 == 0) || (!isStartByNum1 && i % 2 == 1)) {
      var j = isStartByNum1 ? i / 2 : (i - 1) / 2;
      if (numList1[j] == undefined) return -1;
      else if (numList2[j] == undefined) return 1;
      else if (parseFloat(numList1[j]) < parseFloat(numList2[j])) return -1;
      else if (parseFloat(numList1[j]) > parseFloat(numList2[j])) return 1;
    } else {
      var j = isStartByNum1 ? (i - 1) / 2 : i / 2;
      console.log("numm>>", i, j, strList1[j], strList2[j]);
      if (strList1[j] == undefined) return -1;
      else if (strList2[j] == undefined) return 1;
      if (strList1[j] < strList2[j]) {
        return -1;
      } else if (strList1[j] > strList2[j]) return 1;
    }
  }
}

//Add one chapter of manga
async function saveNewChapter(index, name, sections) {
  const newChapter = new Chapter({
    name: name,
    index: index,
  });
  var sectionsList = sections ? [].concat(sections) : [];

  sectionsList.sort((section1, section2) => {
    return (
      section2.originalFilename.split(".")[0] <
      section1.originalFilename.split(".")[0]
    );
  });

  const sectionIds = await addSections(sectionsList);
  newChapter.sections = sectionIds;
  await newChapter.save();
  return newChapter;
}

//Add multiple sections of chapter
async function addSections(sectionsList) {
  const sectionIds = [];
  for (const image of sectionsList) {
    const section = await addSection(image);
    if (section) sectionIds.push(section._id);
  }

  return sectionIds;
}

//Add one sections of chapter
async function addSection(image) {
  const result = await uploadImage(image.filepath);
  if (!result.error) {
    const section = new Section({
      url: result.url,
    });
    await section.save();
    return section;
  } else return null;
}
