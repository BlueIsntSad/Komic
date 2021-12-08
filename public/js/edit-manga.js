$(".input_category").on("click", function (event) {
    $(this).closest("li").toggleClass("active", this.checked);
    var newText = "Thể loại: ";
    $(this).closest("ul").children('input:checked')
    $(this).closest("ul").children('li.active').each(function () {
        newText += $(this).children('label').text() + ', ';
    })
    $("#category_dropdown").text(newText);

    event.stopPropagation();
})

$(".form-check-label").on("click", function (event) {
    event.stopPropagation();
})


function previewImage(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#preview_image').attr('src', e.target.result);
            $('#preview_image').hide();
            $('#preview_image').fadeIn(300);
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        $('#preview_image').attr('src', $('#preview_image').attr('defaultSrc'));
    }
}

function showImage(url) {
    $("#preview_section_image").attr('src', url)
}

function deleteSection(event) {
    const li = $(event.target).closest('li');
    const chapterId = $(event.target).closest('li.chapter').attr('id');
    const id = li.attr('id');
    showLoading();
    $.ajax({
        method: "delete",
        url: `/admin/manga/chapter/${chapterId}/section/${id}`,
        timeout: 60000,
        success: function (result) {
            if (result.success) {
                li.remove();
                showToast('success', "Thành công", "Xoá thành công!");
            } else {
                showToast('error', "Không thành công", "Xoá không thành công!");
            }
            hideLoading();
        },
        error: function (e) {
            hideLoading();
            showToast('error', "Không thành công", "Xoá không thành công!");
        }
    })
}


function changeImageSection(event) {
    event.preventDefault();
    const input = event.target;
    if (input.files && input.files[0]) {
        $(input).parent().children('button.save_button').removeClass('d-none');
        $(input).parent().children('button.cancel_button').removeClass('d-none');
        $(input).parent().children('label.edit_button').addClass('d-none');
        $(input).parent().children('button.delete_button').addClass('d-none');
        var reader = new FileReader();
        reader.onload = function (e) {

            $('#preview_section_image').attr('src', e.target.result);
            $('#preview_section_image').hide();
            $('#preview_section_image').fadeIn(300);
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        $(input).parent().children('button.save_button').addClass('d-none');
        $(input).parent().children('button.cancel_button').addClass('d-none');
        $(input).parent().children('label.edit_button').removeClass('d-none');
        $(input).parent().children('button.delete_button').removeClass('d-none');
    }
}

function cancelEditSection(event) {

    const parent = $(event.target).parent();
    const input = parent.children('input');
    input.files = (new DataTransfer()).files;
    const li = $(event.target).closest('li.caret');
    li.find('button.save_button').addClass('d-none');
    li.find('button.cancel_button').addClass('d-none');
    li.find('label.edit_button').removeClass('d-none');
    li.find('button.delete_button').removeClass('d-none');
}

function saveEditSection(event) {
    const id = $(event.target).closest('li').attr('id');
    const chapterId = $(event.target).closest('li.chapter').attr('id');

    const input = $(event.target).closest('div.caret_title').children('input')[0];
    var formData = new FormData();
    formData.append("sectionImage", input.files[0]);
    showLoading();
    $.ajax({
        method: "PUT",
        url: `/admin/manga/chapter/${chapterId}/section/${id}`,
        timeout: 60000,
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
            if (result.success) {
                showToast('success', "Thành công", "Cập nhật chương thành công!");
                $(event.target).closest('li').attr('onclick', `showImage('${result.newSection.url}')`);
            } else {
                showToast('error', "Không thành công", "Cập nhật không thành công!");
            }
            hideLoading();
        },
        error: function (e) {
            hideLoading();
            showToast('error', "Không thành công", "Cập nhật không thành công!");
        }
    })
}

function showPreviewImage(event) {
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

function deleteInsertSection(event) {
    const count = $(event.target).closest('form').children('li').length;
    const parent = $(event.target).closest('li.chapter');
    $(event.target).closest('li').remove();

    if (count <= 1) {
        parent.find('label.save_insert_chapter').addClass("d-none");
        parent.find('button.cancel_edit_chapter').addClass("d-none");
        parent.find('label.insert_chapter').removeClass("d-none");
        parent.find('button.delete_chapter').removeClass("d-none");
    }
    event.preventDefault();
}

function deleteChap(event) {
    event.preventDefault();
    const li = $(event.target).closest('li');
    const id = li.attr('id');
    showLoading();
    $.ajax({
        method: "delete",
        url: `/admin/manga/chapter/${id}`,
        timeout: 60000,
        success: function (result) {
            if (result.success) {
                li.remove();
                showToast('success', "Thành công", "Xoá thành công!");
            } else {
                showToast('error', "Không thành công", "Xoá không thành công!");
            }
            hideLoading();
        },
        error: function (e) {
            hideLoading();
            showToast('error', "Không thành công", "Xoá không thành công!");
        }
    })


}

function cancelEditChapter(event) {
    $(event.target).closest('li.chapter').find('label.save_insert_chapter').addClass("d-none");
    $(event.target).closest('li.chapter').find('button.cancel_edit_chapter').addClass("d-none");
    $(event.target).closest('li.chapter').find('label.insert_chapter').removeClass("d-none");
    $(event.target).closest('li.chapter').find('button.delete_chapter').removeClass("d-none");
    $(event.target).closest('li.chapter').find('form li').remove();
}

function insertMultipleSection(event) {
    const files = event.target.files;
    if (files && files[0]) {
        const pos = $(event.target).closest('ul').children('form');
        const index = $(event.target).closest('ul').children('li').length;
        const chapter = $(event.target).closest('li.chapter')
        for (let i = 0; i < files.length; i++) {
            addSection(pos, chapter.attr('id'), index + i, files[i])
        }
        $(event.target).closest('li.chapter').find('label.save_insert_chapter').removeClass("d-none");
        $(event.target).closest('li.chapter').find('button.cancel_edit_chapter').removeClass("d-none");
        $(event.target).closest('li.chapter').find('label.insert_chapter').addClass("d-none");
        $(event.target).closest('li.chapter').find('button.delete_chapter').addClass("d-none");
    }
    else {
    }
}

function saveMultipleSection(event) {
    event.preventDefault();
    var form = $(event.target)[0];
    var data = new FormData(form);
    showLoading();
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
            if (result.success) {
                // const numNewSections = event.target.files.length;
                const numNewSections = $(event.target).find('input:file').length;
                const newSection = result.newChapter.sections.slice(-numNewSections);
                const pos = $(event.target).parent().children('hr');
                const index = $(event.target).parent().children('li').length;

                for (let i = 0; i < newSection.length; i++) {

                    insertNewSection(newSection[i], index + i, pos)
                }

                $(event.target).closest('li.chapter').find('label.save_insert_chapter').addClass("d-none");
                $(event.target).closest('li.chapter').find('button.cancel_edit_chapter').addClass("d-none");
                $(event.target).closest('li.chapter').find('label.insert_chapter').removeClass("d-none");
                $(event.target).closest('li.chapter').find('button.delete_chapter').removeClass("d-none");
                $(event.target).closest('li.chapter').find('form li').remove();

                $(event.target).find('input:file').closest('li').remove();
                showToast('success', "Thành công", "Thêm đoạn mới thành công!");
            } else {
                showToast("error", "Không thành công", "Thêm đoạn mới không thành công");
            }
            hideLoading();
        },
        error: function (e) {
            console.log(e);
            hideLoading();
            showToast("error", "Không thành công", "Thêm đoạn mới không thành công")
        }
    })
}


function insertNewSection(newSection, num, pos) {
    var section = $("#template_new_section")
        .clone().removeAttr('id');
    section = $(section);
    section.removeClass('d-none');
    section.attr('id', newSection._id);
    section.attr('onclick', `showImage('${newSection.url}')`);
    section.find(".section_care_title").attr('imgSrc', newSection.url)
    section.find(".section_care_title").text(`Trang ${num}`);
    section.find("label").attr('for', `image_${newSection._id}`);
    section.children("input").attr('id', `image_${newSection._id}`);
    section.insertBefore(pos);

}

function insertNewChapter(newChapter, num) {
    var chapter = $('#template_chapter')
        .clone().removeAttr("id");

    chapter = $(chapter);

    chapter.removeClass('d-none');
    chapter.attr('id', newChapter._id);
    chapter.find(".caret_title div strong").html(`Chương ${num}: ${newChapter.name}`);

    chapter.find("label.insert_chapter").attr('for', `input_chapter${newChapter._id}_sections`);
    chapter.find("label.save_button").attr('for', `submit_save_chapter${newChapter._id}`);

    chapter.find("form").attr('action', `/admin/manga/chapter/${newChapter._id}/section`);
    chapter.find("form").attr('id', `form_chapter${newChapter._id}`);
    chapter.find("form input.i_chapter").val(newChapter._id);
    chapter.find("form input:submit").attr('id', `submit_save_chapter${newChapter._id}`)
    chapter.find("input.input_multiple_sections").attr('id', `input_chapter${newChapter._id}_sections`);

    const sections = newChapter.sections
    for (var t = 0; t < sections.length; t++) {
        insertNewSection(sections[t], t, chapter.find('hr'));
    }
    chapter.appendTo('#chapter_list')
}

function addChapterToModal(event) {
    event.preventDefault();
    event.stopPropagation();
    const inputChapterName = $(event.target).parent().children('input:text')[0];
    console.log($(inputChapterName).val())
    if (!$(inputChapterName).val()) {
        showToast("error", "Không thành công", "Vui lòng nhập tên chương")
        return;
    }

    const inputSectionFiles = $(event.target).parent().children('input:file')[0];
    const countInsert = $('#form_insert_chapter').children('li.chapter').length;
    addChapter($("#chapter_list").children().length + countInsert, $(inputChapterName).val(), $(inputSectionFiles)[0].files);
    $(event.target).parent().find('li.insert_section').removeClass('col-lg-2 col-sm-4 col-md-3 col-6');
    $(event.target).parent().find('li.insert_section').addClass('col-lg-4 col-md-6 col-sm-6 col-12');
}

function addChapter(num, name, files) {
    var chapter = $('#template_insert_chapter')
        .clone().removeAttr("id");

    chapter = $(chapter);
    chapter.removeClass('d-none');
    chapter.attr('id', `insert_chapter_${num}`);
    chapter.find(".caret_title .chapter_title").text(`Chương ${num}: ${name}`);
    chapter.find('.caret_title input.i_chapter').val(`insert_chapter_${num}`);
    chapter.find('.caret_title input.i_chapter_title').val(name);
    chapter.find('.caret_title input.i_chapter_title').attr('name', `insert_chapter_${num}`);
    chapter.appendTo('#form_insert_chapter_list')
    var newFileList = Array.from(files);
    for (var i = 0; i < newFileList.length; i++) {
        addSection(chapter.children('ul.section_list'), `insert_chapter_${num}`, i + 1, files[i]);
    }
}

function addSection(pos, chapter, num, file) {
    var section = $("#template_section")
        .clone().removeAttr('id');
    section = $(section);
    section.removeClass('d-none');
    section.attr('id', `${chapter}_section${num}`);
    section.find(".section_care_title").text(`Trang ${num}`);
    section.find("label").attr('for', `input_${chapter}_section${num}`);

    section.children("input").attr('name', `${chapter}`);
    section.children("input").attr('id', `input_${chapter}_section${num}`);
    section.appendTo(pos)
    const dt = new DataTransfer();
    if (file)
        dt.items.add(file)
    document.getElementById(`input_${section.attr('id')}`).files = dt.files
}

function addInsertSectionToModal(event) {
    var chapter = $(event.target).closest('li');
    var sectionList = chapter.children('ul.section_list')
    addSection(sectionList, chapter.attr('id'), sectionList.children().length + 1, null)
    $(`#input_${chapter.attr('id')}_section${sectionList.children().length}`).click();
    $(event.target).closest('li').find('li.insert_section').removeClass('col-lg-2 col-sm-4 col-md-3 col-6');
    $(event.target).closest('li').find('li.insert_section').addClass('col-lg-4 col-md-6 col-sm-6 col-12');
}

function deleteChapFromModal(event) {
    $(event.target).closest('li').remove();
    event.preventDefault();
}

function submitFormInsertChapter(event) {
    event.preventDefault();
    var form = $(event.target)[0];
    var data = new FormData(form);
    showLoading();
    $.ajax({
        method: "POST",
        url: $(form).attr('action'),
        timeout: 60000,
        data: data,
        processData: false,
        contentType: false,
        success: function (result) {
            if (result.success) {
                $("#insert_chapter_modal").modal('toggle')
                const newManga = result.newManga;
                const nchapter = $(form).find('li.chapter').length;
                if (nchapter) {
                    const newChapter = newManga.chapters.slice(-nchapter);
                    const num = $('#chapter_list').find('li.chapter').length;
                    for (var i = 0; i < nchapter; i++) {
                        insertNewChapter(newChapter[i], num + i)
                    }
                }
                showToast('success', "Thành công", "Thêm chương mới thành công!")
            } else {
                showToast('error', "Không thành công", "Thêm chương mới không thành công!")
            }

            hideLoading();

        },
        error: function (e) {
            console.log(e)
            showToast('error', "Không thành công", "Thêm chương mới không thành công!");
            hideLoading();
        }
    })
}

function submit_edit_info(event) {
    event.preventDefault();
    var form = $(event.target)[0];
    var data = new FormData(form);
    showLoading()
    $.ajax({
        method: "PUT",
        url: $(form).attr('action'),
        timeout: 60000,
        data: data,
        processData: false,
        contentType: false,
        success: function (result) {
            if (result.success) {
                const newManga = result.newManga;
                $('#preview_image').attr('defaultSrc', $('#preview_image').attr('src'));
            } else {
                showToast("error", "Không thành công", result.message);
            }
            hideLoading();

        },
        error: function (e) {
            showToast("error", "Không thành công", "Thông tin truyện đã được cập nhật!");
            hideLoading();
        }
    })
}

function expand(event) {
    event.preventDefault();
    $(event.target).closest('li.caret').children('ul.nested').toggleClass('d-none')
}

$("div.section_care_title").on("mouseenter", function (event) {
    var xOffset = 20;
    var yOffset = -20;
    var docWidth = screen.height * 0.5;
    var docHeight = screen.height * 0.5;
    var posX = event.clientX;
    var posY = event.clientY;
    //reset transform 
    $("#move").css("transform", "translate(0px, 0px)");

    //define transform and offset
    if (posX > docWidth && posY > docHeight) {
        $("#move").css("transform", "translate(-100%, -100%)");
        xOffset = -xOffset;
        yOffset = -yOffset;
    }
    else if (posX > docWidth) {
        $("#move").css("transform", "translateX(-100%)");
        xOffset = -xOffset;
    }
    else if (posY > docHeight) {
        $("#move").css("transform", "translateY(-100%)");
        yOffset = -yOffset
    }

    //Appy css
    $("#move").css("top", posY + yOffset);
    $("#move").css("left", posX + xOffset);
    $("#move").attr("on", true);
    $("#loading_cursor").css("top", posY);
    $("#loading_cursor").css("left", posX + 20);
    $("#loading_cursor").removeClass("d-none");

    $.ajax({
        method: "get",
        url: $(event.target).attr('imgSrc'),
        timeout: 60000,
        success: function (result) {
            if ($("#move").attr("on") == "true") {
                var imgUrl = $(event.target).attr('imgSrc');
                $("#move img").attr("src", imgUrl);
                $("#loading_cursor").addClass("d-none");
                $("#move").removeClass('d-none');
                $('#move').hide();
                $('#move').fadeIn(300);
            }
        },
        error: function (e) {

        }
    })

    $(event.target).on('mouseleave', function () {
        $("#loading_cursor").addClass("d-none");
        $("#move").addClass('d-none');
        $("#move").attr("on", false);
    })
})

$("div.section_care_title").on("mousemove", function (event) {
    var xOffset = 20;
    var yOffset = -20;
    var docWidth = document.body.clientWidth * 0.5;
    var docHeight = screen.height * 0.5;
    var posX = event.clientX;
    var posY = event.clientY;

    $("#move").css("transform", "translate(0px, 0px)");

    if (posX > docWidth && posY > docHeight) {
        $("#move").css("transform", "translate(-100%, -100%)");
        xOffset = -xOffset;
        yOffset = -yOffset;
    }
    else if (posX > docWidth) {
        console.log("show pos")
        $("#move").css("transform", "translateX(-100%)");
        xOffset = -xOffset;
    }
    else if (posY > docHeight) {
        $("#move").css("transform", "translateY(-100%)");
        yOffset = -yOffset
    }

    $("#move").css("top", posY + yOffset);
    $("#move").css("left", posX + xOffset);


    $("#loading_cursor").css("top", posY);
    $("#loading_cursor").css("left", posX + 20);
})

function mouseMove(event) {
    var xOffset = 20;
    var yOffset = -20;
    var docWidth = document.body.clientWidth * 0.5;
    var docHeight = screen.height * 0.5;
    var posX = event.clientX;
    var posY = event.clientY;

    $("#move").css("transform", "translate(0px, 0px)");

    if (posX > docWidth && posY > docHeight) {
        $("#move").css("transform", "translate(-100%, -100%)");
        xOffset = -xOffset;
        yOffset = -yOffset;
    }
    else if (posX > docWidth) {
        console.log("show pos")
        $("#move").css("transform", "translateX(-100%)");
        xOffset = -xOffset;
    }
    else if (posY > docHeight) {
        $("#move").css("transform", "translateY(-100%)");
        yOffset = -yOffset
    }

    $("#move").css("top", posY + yOffset);
    $("#move").css("left", posX + xOffset);


    $("#loading_cursor").css("top", posY);
    $("#loading_cursor").css("left", posX + 20);

    $(event.target).on('mouseleave', function () {
        $("#loading_cursor").addClass("d-none");
        $("#move").addClass('d-none');
        $("#move").attr("on", false);
    })
}

function mouseEnter(event) {
    var xOffset = 20;
    var yOffset = -20;
    var docWidth = screen.height * 0.5;
    var docHeight = screen.height * 0.5;
    var posX = event.clientX;
    var posY = event.clientY;
    //reset transform 
    $("#move").css("transform", "translate(0px, 0px)");

    //define transform and offset
    if (posX > docWidth && posY > docHeight) {
        $("#move").css("transform", "translate(-100%, -100%)");
        xOffset = -xOffset;
        yOffset = -yOffset;
    }
    else if (posX > docWidth) {
        $("#move").css("transform", "translateX(-100%)");
        xOffset = -xOffset;
    }
    else if (posY > docHeight) {
        $("#move").css("transform", "translateY(-100%)");
        yOffset = -yOffset
    }

    //Appy css
    $("#move").css("top", posY + yOffset);
    $("#move").css("left", posX + xOffset);
    $("#move").attr("on", true);
    $("#loading_cursor").css("top", posY);
    $("#loading_cursor").css("left", posX + 20);
    $("#loading_cursor").removeClass("d-none");

    $.ajax({
        method: "get",
        url: $(event.target).attr('imgSrc'),
        timeout: 60000,
        success: function (result) {
            if ($("#move").attr("on") == "true") {
                var imgUrl = $(event.target).attr('imgSrc');
                $("#move img").attr("src", imgUrl);
                $("#loading_cursor").addClass("d-none");
                $("#move").removeClass('d-none');
                $('#move').hide();
                $('#move').fadeIn(300);
            }
        },
        error: function (e) {

        }
    })

    $(event.target).on('mouseleave', function () {
        $("#loading_cursor").addClass("d-none");
        $("#move").addClass('d-none');
        $("#move").attr("on", false);
    })
}

function mouseEnterInsert(event) {
    var xOffset = 20;
    var yOffset = -20;
    var docWidth = screen.height * 0.5;
    var docHeight = screen.height * 0.5;
    var posX = event.clientX;
    var posY = event.clientY;
    //reset transform 
    $("#move").css("transform", "translate(0px, 0px)");

    //define transform and offset
    if (posX > docWidth && posY > docHeight) {
        $("#move").css("transform", "translate(-100%, -100%)");
        xOffset = -xOffset;
        yOffset = -yOffset;
    }
    else if (posX > docWidth) {
        $("#move").css("transform", "translateX(-100%)");
        xOffset = -xOffset;
    }
    else if (posY > docHeight) {
        $("#move").css("transform", "translateY(-100%)");
        yOffset = -yOffset
    }

    //Appy css
    $("#move").css("top", posY + yOffset);
    $("#move").css("left", posX + xOffset);
    $("#move").attr("on", true);
    $("#loading_cursor").css("top", posY);
    $("#loading_cursor").css("left", posX + 20);
    $("#loading_cursor").removeClass("d-none");

    $(event.target).on('mouseleave', function () {
        $("#loading_cursor").addClass("d-none");
        $("#move").addClass('d-none');
        $("#move").attr("on", false);
    })

    const inputEle = $(event.target).closest('li.caret').children('input');
    const input = document.getElementById(inputEle.attr('id'));
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#move img").attr("src", e.target.result);
            $("#loading_cursor").addClass("d-none");
            $("#move").removeClass('d-none');
            $('#move').hide();
            $('#move').fadeIn(300);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function mouseMoveInsert(event) {
    var xOffset = 20;
    var yOffset = -20;
    var docWidth = document.body.clientWidth * 0.5;
    var docHeight = screen.height * 0.5;
    var posX = event.clientX;
    var posY = event.clientY;

    $("#move").css("transform", "translate(0px, 0px)");

    if (posX > docWidth && posY > docHeight) {
        $("#move").css("transform", "translate(-100%, -100%)");
        xOffset = -xOffset;
        yOffset = -yOffset;
    }
    else if (posX > docWidth) {
        console.log("show pos")
        $("#move").css("transform", "translateX(-100%)");
        xOffset = -xOffset;
    }
    else if (posY > docHeight) {
        $("#move").css("transform", "translateY(-100%)");
        yOffset = -yOffset
    }

    $("#move").css("top", posY + yOffset);
    $("#move").css("left", posX + xOffset);


    $("#loading_cursor").css("top", posY);
    $("#loading_cursor").css("left", posX + 20);

    $(event.target).on('mouseleave', function () {
        $("#loading_cursor").addClass("d-none");
        $("#move").addClass('d-none');
        $("#move").attr("on", false);
    })
}

function getImage() {

}
