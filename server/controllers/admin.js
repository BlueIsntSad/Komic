const Category = require("../models/category");
const { Manga } = require("../models/manga");
const Section = require('../models/section');
const Chapter = require('../models/chapter');
const { Mongoose } = require("mongoose");
const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');
const slugify = require('slugify');
const { index } = require("./manga");
const { User, Comment } = require("../models/user");
require('dotenv').config();

//Config cloundinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
    secure: true
});


//Render admin homepage
async function getAdminPage(req, res) {
    let searchQuery = req.query.search ? { title: req.query.search } : {};
    let perPage = 10;
    let page = req.query.page || 1;
    let maxPage = await Manga.countDocuments(searchQuery);
    maxPage = Math.ceil(maxPage / perPage);
    const mangas = await getAllManga(searchQuery, perPage, page);

    let pages = [];
    for (let i = 1; i <= maxPage; i++) {
        pages.push(i)
    }

    res.render('admin', {
        mangas: mangas,
        curentPage: "manga",
        page: page,
        maxPage: maxPage,
        pages: pages,
        pre: parseInt(page) - 1,
        next: parseInt(page) + 1,
        cateList: res.locals.categoryList
    })
}

//Get admin insert manga page
async function getInsertPage(req, res) {
    const categories = await Category.find().lean();
    res.render('insert-manga', {
        categories: categories,
        curentPage: "manga",
        cateList: res.locals.categoryList
    })
}

//Post insert manga to db
async function insertManga(req, res, next) {
    const form = formidable({ multiples: true })
    try {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err)
                return;
            }
            const result = await saveNewManga(fields, files);
            res.json(result)
        });
    }
    catch (err) {
        console.log('insert manga', err);
        res.json({ success: false, message: "Thêm truyện không thành công!" })
    }


}

async function generateSlug(title) {
    var slug = slugify(title, {
        lower: true,
        locale: 'vi',
    });
    var manga = await Manga.findOne({ slug: slug });
    if (manga) {
        console.log(slug)
        const mangaSlugs = await Manga.find({ "slug": new RegExp(`^${slug}-\\d$`) });
        if (mangaSlugs.length > 0) {
            var index = 1;
            mangaSlugs.forEach(mangaItem => {
                var slugArr = mangaItem.slug.split('-');
                index = Math.max(index, parseInt(slugArr.pop()));
            })
            index++;
            slug += '-' + index;
        } else {
            slug += '-1'
        }
    }
    return slug;
}

//PUT edit manga info
async function editMangaInfo(req, res, next) {
    const mangaId = req.params['id'];
    const form = formidable({ multiples: true })
    try {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err)
                return res.json({ success: false, message: "Chỉnh sửa không thành công!", newManga: null });
            }
            const result = await updateMangaInfo(mangaId, fields, files)
            res.json(result);
        });
    }
    catch (err) {
        console.log(err);
        res.json({ success: false, message: "Chỉnh sửa không thành công!", newManga: null });
    }
}

//Upload image to cloudinary
async function uploadImage(path) {
    const result = cloudinary.uploader.upload(path, { resource_type: "image" })
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log('cloudinary', error);
            return { error: true, data: error };
        })
    return result;
}


//Delete manga
async function deleteManga(req, res, next) {
    try {
        const id = req.params['id'];
        const manga = await Manga.findByIdAndDelete(id);
        for (chapter of manga.chapters) {
            const delChapter = await Chapter.findByIdAndDelete(chapter);
            await Section.deleteMany({ _id: { $in: delChapter.sections } })
        }
        res.json({ success: true, message: "Xoá thành công!" })
    }
    catch (err) {
        console.log(err)
        res.json({ success: false, message: "Xoá không thành công!", errorMessage: err.message })
    }

}


//Render manga edit page
async function getEditPage(req, res, next) {
    const id = req.params["id"];
    const categories = await Category.find().lean();
    const manga = await Manga.findById(id).lean()
        .populate({
            path: 'categories'
        })
        .populate({
            path: 'chapters',
            populate: {
                path: 'sections',
                model: 'Section'
            }
        })

    res.render('edit-manga', {
        categories: categories,
        manga: manga,
        curentPage: "manga",
        cateList: res.locals.categoryList
    })
}

//Delete Chapter 
async function deleteChapter(req, res, next) {
    const id = req.params['id'];
    try {
        const delChapter = await Chapter.findByIdAndDelete(id);
        await Section.deleteMany({ _id: { $in: delChapter.sections } })
        const updateQuery = {
            $pull: { "chapters": delChapter._id },
            $inc: { finished: -1 }
        }
        const result = await Manga.updateOne({ chapters: delChapter._id }, updateQuery)
        res.json({ success: true, message: "Thành công!" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Không thành công!" })
    }
}

//Insert chapter 
async function insertChapter(req, res, next) {
    const form = formidable({ multiples: true });
    const mangaId = req.params['manga'];
    try {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err);
                res.json({ success: false, message: "Thêm không thành công!" });
                return;
            }

            if (fields.chapter) {

                const chapterList = [].concat(fields.chapter)
                const chapterIds = await addChapters(chapterList, fields, files);

                if (chapterIds.length <= 0)
                    return res.json({ success: false, message: "Thêm không thành công!" })

                const manga = await Manga.findById(mangaId);
                var index = manga.chapters.indexOf(fields.before);
                if (index == -1)
                    index = manga.chapters.length;
                manga.chapters.splice(index, 0, ...chapterIds);

                const updateQuery = {
                    chapters: manga.chapters,
                    $inc: { finished: chapterIds.length }
                }

                const result = await Manga.findByIdAndUpdate(mangaId, updateQuery, { new: true })
                    .lean()
                    .populate({
                        path: 'categories'
                    })
                    .populate({
                        path: 'chapters',
                        populate: {
                            path: 'sections',
                            model: 'Section'
                        }
                    })

                return res.json({ success: true, message: "Thêm thành công!", newManga: result, start: index, end: index + chapterIds.length });
            } else {
                return res.json({ success: false, message: "Thêm không thành công!" })
            }

        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Thêm không thành công!" })
    }
}

//Edit chapter 
async function editChapter(req, res, next) {
    const id = req.params['id'];
    const form = formidable({ multiples: true });
    try {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err);
                return;
            }

            const name = fields;
            const result = await Chapter.updateOne({ _id: id }, { name: name });

        })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Cập nhật thành công!" })
    }
}

//Delete Section
async function deleteSection(req, res, next) {
    const id = req.params['section'];
    try {
        const delSection = await Section.findByIdAndDelete(id);
        await Chapter.updateOne({ sections: delSection._id }, { "$pull": { "sections": delSection._id } })
        res.json({ success: true, message: "Xoá thành công!" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Xoá không thành công!" })
    }
}

//POST Insert section
async function insertSection(req, res, next) {
    const chapterId = req.params['chapter']
    const form = formidable({ multiples: true });
    try {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err);
                return;
            }
            if (chapterId != fields.chapter)
                return;

            try {
                var sectionsList = files[chapterId] ? [].concat(files[chapterId]) : []
                sectionsList.sort((section1, section2) => {
                    return (section2.originalFilename.split('.')[0] < section1.originalFilename.split('.')[0])
                })
                const sectionIds = await addSections(sectionsList);
                const result = await Chapter.findByIdAndUpdate(chapterId, { $push: { sections: sectionIds } }, { new: true })
                    .populate({
                        path: 'sections',
                        model: 'Section'
                    });

                res.json({ success: true, message: "Thêm thành công!", newChapter: result })
            } catch (err) {
                console.log(err);
                res.json({ success: false, message: "Thêm không thành công!" })
            }


        })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Thêm không thành công!" });
    }
}

//PUT edit section
async function editSection(req, res, next) {
    const form = formidable({ multiples: true })
    try {
        const id = req.params['section'];
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err);
                return;
            }
            const image = files.sectionImage;
            uploadImage(image.filepath)
                .then(async imageUploaded => {
                    const result = await Section.findByIdAndUpdate(id, { url: imageUploaded.url }, { new: true });
                    if (result)
                        res.json({ success: true, newSection: result, message: "Cập nhật thành công!" })
                    else
                        res.json({ success: false, newSection: result, message: "Cập nhật không thành công!" })
                })
                .catch(error => {
                    console.log(error);
                    res.json({ success: false, newSection: null, message: "Cập nhật không thành công!" })
                })
        })
    } catch (error) {
        console.log(error);
        res.json({ success: false, newSection: null, message: "Cập nhật không thành công!", errorMessage: err.message })
    }
}

//Category manage controller

//Get admin category manage page
async function getCategoryPage(req, res) {
    try {
        const categories = await Category.find().lean().exec()
        res.render('category-manage', {
            categories: categories,
            curentPage: "category",
            cateList: res.locals.categoryList
        })
    } catch (error) {
        console.log(error)
    }

}

//POST insert category
async function insertCategory(req, res) {

    try {
        const info = req.body;
        const oldCategory = await Category.findOne({ "name": { $regex: new RegExp(`^${info.name}$`, "i") } });
        if (oldCategory)
            return res.json({ success: false, message: "Thêm không thành công, Tên này đã được sử dụng!", newCategory: null });

        const slug = await generateCategorySlug(info.name);
        const newCategory = new Category({
            name: info.name,
            description: info.description,
            slug: slug,
            color: info.color,
            text_color: info.text_color
        });

        const result = await newCategory.save();
        if (result)
            return res.json({ success: true, message: "Thêm thành công!", newCategory: result });

        return res.json({ success: false, message: "Thêm không thành công!", newCategory: null });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Thêm không thành công!", newCategory: null });
    }
}

async function generateCategorySlug(name) {
    var slug = slugify(name, {
        lower: true,
        locale: 'vi',
    });
    var category = await Category.findOne({ slug: slug });
    if (category) {
        const categorySlugs = await Category.find({ "slug": new RegExp(`^${slug}-\\d$`) });
        if (categorySlugs.length > 0) {
            var index = 1;
            categorySlugs.forEach(categoryItem => {
                var slugArr = categoryItem.slug.split('-');
                index = Math.max(index, parseInt(slugArr.pop()));
            })
            index++;
            slug += '-' + index;
        } else {
            slug += '-1'
        }
    }
    return slug;
}


//PUT edit category
async function editCategory(req, res) {
    try {
        const id = req.params['id'];
        const newInfo = {
            name: req.body.name,
            description: req.body.description,
            color: req.body.color,
            text_color: req.body.text_color
        }
        const result = await Category.findByIdAndUpdate(id, newInfo, { new: true });
        if (result)
            return res.json({ success: true, message: "Chỉnh sửa thành công!", newCategory: result });

        res.json({ success: false, message: "Chỉnh sửa không thành công!", newCategory: null })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Chỉnh sửa không thành công!", newCategory: null })
    }
}

//Delete category
async function deleteCategory(req, res) {
    try {
        const id = req.params['id'];
        const manga = await Manga.findOne({ "categories": id });
        if (manga)
            return res.json({ success: false, message: "Xoá thành công, đã có truyện thuộc thể loại này!" });
        const result = await Category.findByIdAndDelete(id);
        if (result)
            return res.json({ success: true, message: "Xoá thành công!" });
        return res.json({ success: false, message: "Xoá không thành công" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Xoá không thành công!" })
    }
}

async function dasboard(req, res) {
    try {
        const categories = await Category.find();
        const categoriesData = await Promise.all(categories.map(async (category) => {
            const mangas = await Manga.find({ categories: category._id });
            var totalViews = 0;
            mangas.forEach(manga => {
                totalViews += manga.views;
            })
            return { ...category._doc, mangas: mangas.length, totalViews: totalViews }
        }))

        const totalViews = await Manga.aggregate(
            [{
                $group: {
                    _id: "total",
                    totalViews: { $sum: "$views" },
                    totalMangas: { $sum: 1 }
                }
            }]
        )
        const totalUsers = await User.countDocuments();
        const totalComments = await Comment.countDocuments();

        const mangaStatus = await Manga.aggregate(
            [{
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }]
        )

        const mangaCreated = await Manga.aggregate(
            [{
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            }]
        )

        mangaCreated.sort((item1, item2) => {
            var d1 = Date.parse(item1._id);
            var d2 = Date.parse(item2._id);
            return d1 - d2;
        })

        const dashboardData = {
            categories: categoriesData,
            mangaStatus: mangaStatus,
            mangaCreated: mangaCreated,
            totalViews: totalViews[0].totalViews,
            totalUsers: totalUsers,
            totalComments: totalComments,
            totalMangas: totalViews[0].totalMangas
        }

        const dashboardJSONData = JSON.stringify(dashboardData);
        res.render('dashboard', { dashboardData: dashboardData, curentPage: "dashboard", cateList: res.locals.categoryList })

    } catch (error) {
        console.log(error);
        res.redirect('/admin/dashboard')
    }
}


module.exports = {
    getAdminPage,
    getInsertPage,
    getCategoryPage,
    insertManga,
    deleteManga,
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
    dasboard
}


//--------------ADMIN SERVICE------------------//

//Get all manga
async function getAllManga(query, perPage, page) {
    const mangas = await Manga
        .find(query)
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .populate({
            path: 'categories'
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
}

const requiredTextProp = {
    title: "Tên truyện",
    description: "Tóm tắt",
    author: "Tác giả",
    translator: "Dịch giả",
    status: "Tình trạng",
    releaseDay: "Ngày xuất bản",
    categories: "Thể loại",
    total: "Số tập",
}

//check valid date
function isValidDate(date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

//Check valid manga//
function checkManga(manga, files, isNew) {
    for (const prop in requiredTextProp) {
        if (!manga[prop])
            return { valid: false, message: `${textPropName[prop]} Không được bỏ trống!` }
    }

    if (!isValidDate(manga.releaseDay))
        return { valid: false, message: `Ngày xuất bản không hợp lệ!` };
    else if (isNaN(parseInt(manga.total)) || parseInt(manga.total) < 0)
        return { valid: false, message: `Số chương không hợp lệ!` };
    else if (!files.coverImage.size && isNew)
        return { valid: false, message: "Ảnh bìa không dược để trống!" };
    else
        return { valid: true, message: "" }
}


//Save new manga
async function saveNewManga(fields, files) {
    const checkResult = checkManga(fields, files, true)
    if (!checkResult.valid)
        return { success: false, message: checkResult.message };

    try {
        const slug = await generateSlug(fields.title)
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
            slug: slug
        })

        if (files.coverImage.size) {
            const result = await uploadImage(files.coverImage.filepath);
            if (!result.error)
                newManga.cover = result.url;
        }

        if (fields.chapter) {
            const chapterList = [].concat(fields.chapter)
            const chapterIds = await addChapters(chapterList, fields, files);
            newManga.chapters = chapterIds;
            newManga.finished = chapterIds.length;
        }

        newManga.total = newManga.finished > newManga.total ? newManga.finished : newManga.total;
        await newManga.save();
        return { success: true, message: "Thêm thành công!" };

    } catch (err) {
        return { success: false, message: "Thêm không thành công!" };
    }

}


//Update manga info 
async function updateMangaInfo(mangaId, fields, files) {
    const checkResult = checkManga(fields, files, false)
    if (!checkResult.valid)
        return { success: false, message: checkResult.message }

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
            total: fields.total
        }

        if (files.coverImage.size) {
            const result = await uploadImage(files.coverImage.filepath);
            if (!result.error)
                newInfo.cover = result.url;
        }

        const result = await Manga.findByIdAndUpdate(mangaId, newInfo, { new: true })
        if (result)
            return { success: true, message: "Cập nhật thông tin truyện thành công!", newManga: result }
        else
            return { success: false, message: "Cập nhật thông tin truyện không thành công!", newManga: null }
    } catch (err) {
        console.log(err);
        return { success: false, message: "Cập nhật thông tin truyện không thành công!", newManga: null }
    }

}

//add multiple chapters of manga
async function addChapters(chapterList, fields, files) {
    const chapterIds = []
    for (chap of chapterList) {
        if (fields[chap] == "" || fields[chap] == undefined)
            continue;
        const chapter = await addChapter(fields[chap], files[chap])
        chapterIds.push(chapter._id)
    }
    return chapterIds;
}

//Add one chapter of manga 
async function addChapter(name, sections) {
    const newChapter = new Chapter({
        name: name,
        index: name
    })
    var sectionsList = sections ? [].concat(sections) : []

    sectionsList.sort((section1, section2) => {
        return (section2.originalFilename.split('.')[0] < section1.originalFilename.split('.')[0])
    })

    const sectionIds = await addSections(sectionsList);
    newChapter.sections = sectionIds;
    await newChapter.save();
    return newChapter
}


//Add multiple sections of chapter
async function addSections(sectionsList) {
    const sectionIds = []
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
            url: result.url
        });
        await section.save();
        return section;
    }
    else
        return null;
}