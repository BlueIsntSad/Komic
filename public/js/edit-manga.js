$(".input_category").on("click", function(event){
    $(this).closest("li").toggleClass("active", this.checked);
    var newText = "Thể loại: ";
    $(this).closest("ul").children('input:checked')
    $(this).closest("ul").children('li.active').each(function(){
        newText += $(this).children('label').text()+ ', ';
    })
    $("#category_dropdown").text(newText);

    event.stopPropagation();
})

$(".form-check-label").on("click", function(event){
    event.stopPropagation();
})


function show_preview_image(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#preview_image').attr('src', e.target.result);            
            $('#preview_image').hide();
            $('#preview_image').fadeIn(300);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function showImage(url){
    $("#preview_section_image").attr('src', url)
}

function deleteSection(event){
    const li = $(event.target).closest('li');
    const chapterId = $(event.target).closest('li.chapter').attr('id');
    const id = li.attr('id');

    $.ajax({
        method: "delete",
        url: `/admin/manga/chapter/${chapterId}/section/${id}`,
        timeout: 60000,
        success: function (result) {
            console.log(result)
            if(result.success)
                li.remove();
        },
        error: function (e) {
                
        }
    })
}


function changeImageSection(event){
    event.preventDefault();
    const input = event.target;
    if (input.files && input.files[0]) {
        $(input).parent().children('button.save_button').removeClass('d-none')
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#preview_section_image').attr('src', e.target.result);            
            $('#preview_section_image').hide();
            $('#preview_section_image').fadeIn(300);
        };
        reader.readAsDataURL(input.files[0]);
    }else{
        $(input).parent().children('button.save_button').addClass('d-none')
    } 
}

function saveEditSection(event){
    const id = $(event.target).closest('li').attr('id');
    const chapterId = $(event.target).closest('li.chapter').attr('id');

    const input = $(event.target).closest('div.caret_title').children('input')[0];
    var formData = new FormData();
    formData.append("sectionImage", input.files[0])
    $.ajax({
        method: "PUT",
        url: `/admin/manga/chapter/${chapterId}/section/${id}`,
        timeout: 60000,
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
            $(event.target).closest('li').attr('onclick',`showImage('${result.newSection.url}')`)
        },
        error: function (e) {
                
        }
    })
}


function showPreviewImage(event){
    const section = $(event.target).closest('li');
    const input = section.children('input')[0];
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {

            $('#preview_section_image').attr('src', e.target.result);            
            $('#preview_section_image').hide();
            $('#preview_section_image').fadeIn(400);
        };
        reader.readAsDataURL(input.files[0]);
    }

}

function deleteInsertSection(event){
    $(event.target).closest('li').remove(); 
    event.preventDefault();
}

function deleteChap(event){
    event.preventDefault(); 
    const li = $(event.target).closest('li');
    const id = li.attr('id');
    $.ajax({
        method: "delete",
        url: `/admin/manga/chapter/${id}`,
        timeout: 60000,
        success: function (result) {
            if(result.success)
                li.remove();
        },
        error: function (e) {
                
        }
    })
   
   
}




function insertMultipleSection(event){
    const files  = event.target.files;
    if(files && files[0]){
        const pos = $(event.target).closest('ul').children('form');
        console.log(pos)
        const index =  $(event.target).closest('ul').children('li').length;
        const chapter = $(event.target).closest('li.chapter')
        for(let i=0; i< files.length; i++){
            addSection(pos, chapter.attr('id') ,index + i, files[i])
        }
    }
    else {

    }
}

function saveMultipleSection(event){
    event.preventDefault();
    var form = $(event.target)[0];
    var data = new FormData(form);
    $.ajax({
        method: "post",
        enctype: 'multipart/form-data',
        url: $(event.target).attr('action'),
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 60000,
        success: function (result) {
            if(result.success)
            {
                // const numNewSections = event.target.files.length;
                const numNewSections = $(event.target).find('input:file').length;
                const newSection = result.newChapter.sections.slice(-numNewSections);
                console.log(newSection);
                const pos = $(event.target).parent().children('hr');
                const index = $(event.target).parent().children('li').length;

                for(let i =0; i < newSection.length; i++){
               
                    insertNewSection(newSection[i], index+i, pos)
                }
                $(event.target).find('input:file').closest('li').remove()
            }
        },
        error: function (e) {
            console.log(e)
        }
    })
}


function insertNewSection(newSection, num, pos){
    var section  = $("#template_new_section")
                    .clone().removeAttr('id');
    section = $(section);
    section.removeClass('d-none');
    section.attr('id', newSection._id);
    section.attr('onclick', `showImage('${newSection.url}')`)
    section.find(".section_care_title").text(`section ${num}`);
    section.find("label").attr('for', `image_${newSection._id}`);
    section.children("input").attr('id', `image_${newSection._id}`);  
    section.insertBefore(pos);
    
}

function insertNewChapter(newChapter, num){
    var chapter =  $('#template_chapter')
                    .clone().removeAttr("id");

    chapter = $(chapter);
  
    chapter.removeClass('d-none');
    chapter.attr('id', newChapter._id);
    chapter.find(".caret_title div").html(`Chương ${num}: ${newChapter.name}`);  
    
    chapter.find("label.insert_chapter").attr('for', `input_chapter${newChapter._id}_sections`);
    chapter.find("label.save_button").attr('for', `submit_save_chapter${newChapter._id}`);

    chapter.find("form").attr('action', `/admin/manga/chapter/${newChapter._id}/section`);
    chapter.find("form").attr('id', `form_chapter${newChapter._id}`);
    chapter.find("form input.i_chapter").val(newChapter._id);
    chapter.find("form input:submit").attr('id', `submit_save_chapter${newChapter._id}`)    
    chapter.find("input.input_multiple_sections").attr('id', `input_chapter${newChapter._id}_sections`); 
    
    const sections = newChapter.sections
    for(var t = 0; t< sections.length; t++){
        insertNewSection(sections[t], t , chapter.find('hr'));
    } 
    chapter.appendTo('#chapter_list')
    console.log(chapter.attr('id'))
}

function addChapterToModal(event){
    event.preventDefault();
    event.stopPropagation();
    const inputChapterName  = $(event.target).parent().children('input:text')[0];
    const inputSectionFiles = $(event.target).parent().children('input:file')[0];
    console.log($(inputSectionFiles)[0].files)
    addChapter($("#chapter_list").children().length+1, $(inputChapterName).val(), $(inputSectionFiles)[0].files)
}



function addChapter(num, name, files){
    var chapter =  $('#template_insert_chapter')
                    .clone().removeAttr("id");

    chapter = $(chapter);
    chapter.removeClass('d-none');
    chapter.attr('id', `insert_chapter_${num}`);
    chapter.find(".caret_title .chapter_title").text(`Chương ${num}: ${name}`);
    chapter.find('.caret_title input.i_chapter').val(`insert_chapter_${num}`); 
    chapter.find('.caret_title input.i_chapter_title').val(name);
    chapter.find('.caret_title input.i_chapter_title').attr('name',`insert_chapter_${num}`);  
    chapter.appendTo('#form_insert_chapter')
    var newFileList = Array.from(files);
    for(var i =0; i< newFileList.length; i++){
        addSection(chapter.children('ul.section_list'), `insert_chapter_${num}`, i+1, files[i]);
    }  
}

function addSection(pos, chapter, num, file){
    var section  = $("#template_section")
                    .clone().removeAttr('id');
    section = $(section);
    section.removeClass('d-none');
    section.attr('id', `${chapter}_section${num}`);
    section.find(".section_care_title").text(`section ${num}`);
    section.find("label").attr('for', `input_${chapter}_section${num}`);

    section.children("input").attr('name', `${chapter}`);
    section.children("input").attr('id', `input_${chapter}_section${num}`);
    section.appendTo(pos)
    const dt = new DataTransfer();
    dt.items.add(file)
    document.getElementById(`input_${section.attr('id')}`).files = dt.files
}

function addInsertSectionToModal(event){
    var chapter = $(event.target).closest('li');
    var sectionList = chapter.children('ul.section_list')
    addSection(sectionList, chapter.attr('id'), sectionList.children().length + 1, null)
    $(`#input_${ chapter.attr('id')}_section${sectionList.children().length}`).click();
}

function deleteChapFromModal(event){
    $(event.target).closest('li').remove();
    event.preventDefault(); 
}

function submitFormInsertChapter(event){
    event.preventDefault();
    var form = $(event.target)[0];
    var data = new FormData(form);
    $.ajax({
        method: "POST",
        url: $(form).attr('action'),
        timeout: 60000,
        data: data,
        processData: false,
        contentType: false,
        success: function (result) {
           const newManga = result.newManga;
           const nchapter = $(form).children('li.chapter').length;
           const newChapter = newManga.chapters.slice(-nchapter);
           console.log(newChapter)
           const num = $('#chapter_list').children('li.chapter').length;
           for(var i=0; i<nchapter; i++){
                insertNewChapter(newChapter[i], num + i)
           }
          
        },
        error: function (e) {
                
        }
    })
}

function submit_edit_info(event){
    event.preventDefault();
    var form = $(event.target)[0];
    var data = new FormData(form);
    $.ajax({
        method: "PUT",
        url: $(form).attr('action'),
        timeout: 60000,
        data: data,
        processData: false,
        contentType: false,
        success: function (result) {
           const newManga = result.newManga;
           console.log(result)
        },
        error: function (e) {
                
        }
    })
}