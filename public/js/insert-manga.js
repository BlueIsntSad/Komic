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
            $('#preview_image').fadeIn(650);
        };
        reader.readAsDataURL(input.files[0]);
    }
}


function insertNewChap(){
    var name = $('input#input_chapter_name').val();
    var files = $("input#input_section_files")[0].files;
    
    addChapter($("#chapter_list").children().length+1, name, files)
    // console.log($("#chapter_list").children());
    // console.log($("#chapter_list").children().length);
}

function addChapter(num, name, files){
    var chapter =  $('#template_chapter')
                    .clone().removeAttr("id");

    chapter = $(chapter);
    chapter.removeClass('d-none');
    chapter.attr('id', `insert_chapter_${num}`);
    chapter.find(".caret_title .chapter_title").text(`Chương ${num}: ${name}`);
    chapter.find('.caret_title input.i_chapter').val(`insert_chapter_${num}`); 
    chapter.find('.caret_title input.i_chapter_title').val(name);
    chapter.find('.caret_title input.i_chapter_title').attr('name',`insert_chapter_${num}`);  
    chapter.appendTo('#chapter_list')
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
    $(event.target).closest('li').remove();
    event.preventDefault(); 
}

function addInsertSection(event){
    var chapter = $(event.target).closest('li');
    var sectionList = chapter.children('ul.section_list')
    addSection(sectionList, chapter.attr('id'), sectionList.children().length + 1, null)
    $(`#input_${ chapter.attr('id')}_section${sectionList.children().length}`).click();
}

