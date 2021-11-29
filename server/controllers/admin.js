const Category = require("../models/category");
const Manga = require("../models/manga");
const Section = require('../models/section');
const Chapter = require('../models/chapter');
const { Mongoose } = require("mongoose");
const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');
require('dotenv').config();

//Config cloundinary
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_KEY, 
    api_secret: process.env.CLOUD_SECRET,
    secure: true
});

//Render admin homepage
async function getAdminPage(req, res){

    let perPage = 10; 
    let page = req.params.page || 1; 
    let maxPage = await  Manga.countDocuments({})
    maxPage = Math.ceil(maxPage / perPage);
    const mangas = await Manga
        .find()
        .skip((perPage * page)- perPage)
        .limit(perPage)
        .populate({
            path: 'categories'
        })
        .lean();
    
    let pages = [];
    for(let i =1; i<= maxPage; i++){
        pages.push(i)
    } 

    res.render('admin', {
        mangas: mangas,
        curentPage: "manga",
        page: page,
        maxPage: maxPage,
        pages: pages,
        pre: parseInt(page) - 1,
        next: parseInt(page) + 1
    })
}

//Get admin insert manga page
async function getInsertPage(req, res){
    const categories = await Category.find().lean();

    res.render('insert-manga', {
        categories: categories,
        curentPage: "manga"
    })
}

//Post insert manga to db
async function insertManga(req, res, next){
    const form = formidable({ multiples: true })
    try {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err)
                return;
            }
            const newManga = new Manga({
                title: fields.title,
                description:fields.description,
                author: fields.author,
                translator: fields.translator,
                status: fields.status,
                releaseDay: fields.releaseDay,
                createdAt: fields.createdAt,
                categories: fields.category,
                total: fields.total,
                chapter: [],
                finished: 0
            })
            if(files.coverImage)
            {
                const result = await uploadImage(files.coverImage.filepath);
                if(!result.error)
                    newManga.cover = result.url;
            }

            if(fields.chapter){
                const chapterList = [].concat(fields.chapter)
                const chapterIds = await addChapters(chapterList, fields, files);
                newManga.chapters = chapterIds;
                newManga.finished  = chapterIds.length;
            }

            newManga.total = newManga.finished > newManga.total ? newManga.finished: newManga.total;
            await newManga.save();
            return res.redirect('/admin')
        });
    }
    catch(err){
        console.log('insert manga', err);
        res.redirect('/admin/manga/insert')
    }
    
  
}

//PUT edit manga info
async function editMangaInfo(req, res, next){
    const mangaId = req.params['id'];
    const form = formidable({ multiples: true })
    try {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err)
                return;
            }
            const newInfo = {
                title: fields.title,
                description:fields.description,
                author: fields.author,
                translator: fields.translator,
                status: fields.status,
                releaseDay: fields.releaseDay,
                createdAt: fields.createdAt,
                categories: fields.category,
                total: fields.total
            }
            if(files.coverImage)
            {
                const result = await uploadImage(files.coverImage.filepath);
                if(!result.error)
                    newManga.cover = result.url;
            }

            const result = await Manga.findByIdAndUpdate(mangaId, newInfo, {new: true})
            res.json({success: true, message: "Chỉnh sửa thành công!", newManga: result});
        });
    }
    catch(err){
        console.log(err);
        res.json({success: false, message: "Chỉnh sửa không thành công!", newManga: null});
    }
}

//add multiple chapters of manga
async function addChapters(chapterList, fields, files){
    const chapterIds = []
    for(chap of chapterList){
        const chapter = await addChapter( fields[chap],files[chap] )
        chapterIds.push(chapter._id)
    }
    return chapterIds;
}

//Add one chapter of manga 
async function addChapter(name, sections){
    const newChapter = new Chapter({
        name: name,
    })
    var sectionsList = sections ?  [].concat(sections):[]
    
    sectionsList.sort((section1, section2)=>{
        return (section2.originalFilename.split('.')[0] < section1.originalFilename.split('.')[0])
    })
       
    const sectionIds = await addSections(sectionsList);
    newChapter.sections = sectionIds;
    await newChapter.save();
    return newChapter
}

//Add multiple sections of chapter
async function addSections(sectionsList){
    const sectionIds = []
    for(const image of sectionsList){
        const section = await addSection(image);
        if(section) sectionIds.push(section._id);
    }
    
    return sectionIds;
}

//Add one sections of chapter
async function addSection(image){
    const result = await uploadImage(image.filepath);
        if(!result.error){
            const section = new Section({
                url:result.url
            });
            await section.save();
           return section;
        }
        else
            return null;
}

//Upload image to cloudinary
async function uploadImage(path){
    const result = cloudinary.uploader.upload(path, {resource_type: "image"})
                    .then(result=>{
                        return result;
                    })
                    .catch(error=>{
                        console.log('cloudinary',error);
                        return {error:true, data:error};
                    })
    return result;
}


//Delete manga
async function deleteManga(req, res, next){
    try{
        const id = req.params['id'];
        const manga = await Manga.findByIdAndDelete(id);
        for(chapter of manga.chapters){
            const delChapter = await Chapter.findByIdAndDelete(chapter);
            await Section.deleteMany({_id: {$in: delChapter.sections}})
        }
        res.json({success: true, message: "Xoá thành công!"})
    }
    catch(err){
        console.log(err)
        res.json({success: false, message: "Xoá không thành công!", errorMessage: err.message})
    }
    
}


//Render manga edit page
async function getEditPage(req, res, next){
    const id = req.params["id"];
    const categories = await Category.find().lean();
    const manga = await Manga.findById(id).lean()
        .populate({
            path: 'categories'
        })
        .populate({
            path: 'chapters',
            populate:{
                path: 'sections',
                model: 'Section'
            }
        })
    
    res.render('edit-manga', {
        categories: categories,
        manga : manga,
        curentPage: "manga"
    })
}

//Delete Chapter 
async function deleteChapter(req, res, next){
    const id = req.params['id'];
    try {
        const delChapter = await Chapter.findByIdAndDelete(id);
        await Section.deleteMany({_id: {$in: delChapter.sections}})
        const updateQuery = {
            $pull: { "chapters": delChapter._id },
            $inc: { finished: -1}
        }
        const result = await Manga.updateOne({chapters: delChapter._id}, updateQuery)
        res.json({success: true, message: "Thành công!"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Không thành công!"})
    }
}

//Insert chapter 
async function insertChapter(req, res, next){
    const form = formidable({ multiples: true });
    const mangaId = req.params['manga'];
    try{   
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err);
                res.json({success: false, message:"Thêm không thành công!"});
                return;
            }

            if(fields.chapter){
                const chapterList = [].concat(fields.chapter)
                const chapterIds = await addChapters(chapterList, fields, files);
                const updateQuery = { 
                    $push: { chapters: chapterIds },
                    $inc: { finished: chapterIds.length}
                } 
                const result = await Manga.findByIdAndUpdate(mangaId, updateQuery, {new: true})
                    .lean()
                    .populate({
                        path: 'categories'
                    })
                    .populate({
                        path: 'chapters',
                        populate:{
                            path: 'sections',
                            model: 'Section'
                        }
                    })

                res.json({success: true, message: "Thêm thành công!", newManga: result});
            }
        });
    }catch(error){
        console.log(error);
        res.json({success: false, message:"Thêm không thành công!"})
    }
}

//Edit chapter 
async function editChapter(req, res, next){
    const id = req.params['id'];
    const form = formidable({ multiples: true });
    try{
        form.parse(req, async (err, fields, files)=>{
            if(err){
                console.log(err);
                return;
            }

            const name = fields;
            const result  = await Chapter.updateOne({_id: id}, {name: name});

        })
    }catch(error){
        console.log(error);
        res.json({success: false, message: "Cập nhật thành công!"})
    }
}

//Delete Section
async function deleteSection(req, res, next){
    const id = req.params['section'];
    try {
        const delSection = await Section.findByIdAndDelete(id);
        await Chapter.updateOne({sections: delSection._id}, {"$pull": { "sections": delSection._id } } )
        res.json({success: true, message: "Xoá thành công!"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Xoá không thành công!"})
    }
}

//POST Insert section
async function insertSection(req, res, next){
    const chapterId = req.params['chapter']
    const form = formidable({ multiples: true });
    try{
        form.parse(req, async (err, fields, files)=>{
            if(err){
                console.log(err);
                return;
            }
            if(chapterId!=fields.chapter)
                return;

            try{
                var sectionsList = files[chapterId] ? [].concat(files[chapterId]):[] 
                sectionsList.sort((section1, section2)=>{
                    return (section2.originalFilename.split('.')[0] < section1.originalFilename.split('.')[0])
                })
                const sectionIds = await addSections(sectionsList);
                const result = await Chapter.findByIdAndUpdate(chapterId, { $push: { sections: sectionIds }}, {new: true})
                    .populate({
                        path: 'sections',
                        model: 'Section'
                    }) ;

                res.json({success: true, message: "Thêm thành công!", newChapter: result})                
            }catch(err){
                console.log(err);
                res.json({success: false, message: "Thêm không thành công!"})
            }


        })
    }catch(error){
        console.log(error);
        res.json({success: false, message: "Thêm không thành công!"});
    }
}

//PUT edit section
async function editSection(req, res, next){
    const form = formidable({ multiples: true })
    try {
        const id = req.params['section'];
        form.parse(req, async (err, fields, files)=>{
            if(err){
                console.log(err);
                return ;
            }
            const image = files.sectionImage;
            uploadImage(image.filepath)
            .then(async imageUploaded=>{
                const result = await Section.findByIdAndUpdate(id, {url: imageUploaded.url}, {new: true});
                if(result)
                    res.json({success: true, newSection: result, message:"Cập nhật thành công!"})
                else
                    res.json({success: false, newSection: result, message:"Cập nhật không thành công!"})    
            })
            .catch(error =>{
                console.log(error);
                res.json({success: false, newSection: null, message: "Cập nhật không thành công!"})
            })
        })    
    } catch (error) {
        console.log(error);
        res.json({success: false, newSection: null, message: "Cập nhật không thành công!",  errorMessage: err.message})
    }
}

//Category manage controller

//Get admin category manage page
async function getCategoryPage(req, res){
    try{
        const categories = await Category.find().lean().exec()
        res.render('category-manage', {
            categories: categories,
            curentPage: "category"
        })
    }catch(error){
        console.log(error)
    }
   
}

//POST insert category
async function insertCategory(req, res){
    
    try {
        const info = req.body;
        const newCategory = new Category({
           name: info.name,
           description: info.description 
        });

        const result = await newCategory.save();
        if(result)
            return res.json({success: true, message: "Thêm thành công!", newCategory: result});

        res.json({success: false, message: "Thêm không thành công!", newCategory: null});
    }catch(error){
        console.log(error);
        res.json({success: false, message: "Thêm không thành công!", newCategory: null});
    }
}

//PUT edit category
async function editCategory(req, res){
    try {
        const id = req.params['id'];
        const newInfo = {
            name: req.body.name,
            description: req.body.description
        }
        const result = await Category.findByIdAndUpdate(id, newInfo, {new: true});
        if(result)
            return res.json({success: true, message: "Chỉnh sửa thành công!", newCategory: result});

        res.json({success: false, message: "Chỉnh sửa không thành công!", newCategory: null})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Chỉnh sửa không thành công!", newCategory: null})
    }
}

//Delete category
async function deleteCategory(req, res){
    try {
        const id = req.params['id'];
        const result = await Category.findByIdAndDelete(id);
        if(result)
            return res.json({success: true, message: "Xoá thành công!"});
        return res.json({success: false, message: "Xoá không thành công"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Xoá không thành công!"})
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
    deleteCategory
}